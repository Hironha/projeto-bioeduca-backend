import { db, storage } from "@utils/database";

import { PlantModel } from "@data/models/plant";
import { type PlantEntity } from "@data/entities/plant";
import { type ListPaginatedInputEntity } from "@data/entities/listPaginatedInput";
import { type IStoredPlantModel } from "@data/interfaces/models/plant";

export class PlantRepository {
	private readonly colletionName = "plants";
	private readonly storageName = "plants";

	constructor() {}

	async consultPlantById(id: string) {
		const doc = await db.collection(this.colletionName).doc(id).get();
		if (!doc.exists) return undefined;
		const plantData = doc.data() as IStoredPlantModel;
		return PlantModel.fromStore({ ...plantData, id: doc.id });
	}

	async list(listEntity: ListPaginatedInputEntity) {
		const lastSentPlantSnapshot = await (async (plantId: string | undefined) => {
			if (!plantId) return undefined;
			return await db.collection(this.colletionName).doc(plantId).get();
		})(listEntity.lastKey);

		const listQuery = db
			.collection(this.colletionName)
			.limit(listEntity.perPage + 1)
			.orderBy("created_at", "desc");

		const listSnapshot = await (async () => {
			if (lastSentPlantSnapshot) return await listQuery.startAfter(lastSentPlantSnapshot).get();
			return await listQuery.get();
		})();

		const queriedSnapshots = listSnapshot.docs.slice(0, listEntity.perPage);
		const plantModels: PlantModel[] = queriedSnapshots.map((plantDoc) => {
			const storedPlantData = plantDoc.data() as IStoredPlantModel;
			return PlantModel.fromStore({ ...storedPlantData, id: plantDoc.id });
		});

		return {
			hasMore: listSnapshot.size > plantModels.length,
			plantModels,
		};
	}

	async create(plantEntity: PlantEntity) {
		const { images, ...plantData } = plantEntity.export();

		const newPlantDocRef = db.collection(this.colletionName).doc();

		const storedImageURLs = await ((images: Express.Multer.File[] | undefined) => {
			if (!images) return [] as string[];
			return this.storeImages(newPlantDocRef.id, images);
		})(images);

		const plantModel = new PlantModel({
			...plantData,
			images: storedImageURLs,
			id: newPlantDocRef.id,
		});

		await newPlantDocRef.set(plantModel.export());

		return plantModel;
	}

	async storeImages(plantId: string, images: Express.Multer.File[]) {
		return await Promise.all(images.map((file) => this.storeImage(plantId, file)));
	}

	async storeImage(plantId: string, image: Express.Multer.File) {
		const bucket = storage.bucket();
		const file = bucket.file(
			`${this.storageName}/${plantId}/${image.filename || image.originalname}`
		);
		await file.save(image.buffer, {
			public: true,
			metadata: {
				contentType: image.mimetype,
				cacheControl: "public, max-age=" + 60 * 60 * 24,
			},
		});

		return file.publicUrl();
	}
}
