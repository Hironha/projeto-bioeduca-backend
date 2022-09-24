import { db, storage } from "@utils/database";

import { PlantModel } from "@data/models/plant";
import { PlantPreviewModel } from "@data/models/plantPreview";
import { type IPlantEntity } from "@data/interfaces/entities/plant";
import { type IListPaginatedEntityInput } from "@data/interfaces/entities/listPaginatedInput";
import { type IStoredPlantModel, IPlantPreviewModel } from "@data/interfaces/models/plant";

export class PlantRepository {
	private readonly colletionName = "plants";
	private readonly storageName = "plants";

	constructor() {}

	private async getPlantSnapshot(plantId?: string) {
		if (!plantId) return undefined;
		return await db.collection(this.colletionName).doc(plantId).get();
	}

	private async getListSnapshot(
		query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>,
		lastPlantIdSent?: string
	) {
		const lastSnapshotSent = await this.getPlantSnapshot(lastPlantIdSent);

		if (lastSnapshotSent) return await query.startAfter(lastSnapshotSent).get();
		return await query.get();
	}

	async consultPlantById(id: string) {
		const doc = await db.collection(this.colletionName).doc(id).get();
		if (!doc.exists) return undefined;

		const { images, ...plantData } = doc.data() as IStoredPlantModel;
		const imageURLs = this.listPlantImagesURLs(doc.id, images || []);
		return new PlantModel({ ...plantData, images: imageURLs, id: doc.id });
	}

	async list(listEntity: IListPaginatedEntityInput) {
		const listQuery = db
			.collection(this.colletionName)
			.limit(listEntity.perPage + 1)
			.orderBy("created_at", "desc");

		const listSnapshot = await this.getListSnapshot(listQuery, listEntity.lastKey);

		const queriedSnapshots = listSnapshot.docs.slice(0, listEntity.perPage);
		const plantModels: PlantModel[] = queriedSnapshots.map((plantDoc) => {
			const { images, ...plantData } = plantDoc.data() as IStoredPlantModel;
			return new PlantModel({ ...plantData, images, id: plantDoc.id });
		});

		return {
			hasMore: listSnapshot.size > plantModels.length,
			plantModels,
		};
	}

	async listPreview(listEntity: IListPaginatedEntityInput) {
		const listQuery = db
			.collection(this.colletionName)
			.limit(listEntity.perPage + 1)
			.select("scientific_name", "popular_name", "images")
			.orderBy("created_at", "desc");

		const listSnapshot = await this.getListSnapshot(listQuery, listEntity.lastKey);

		const queriedSnapshots = listSnapshot.docs.slice(0, listEntity.perPage);
		const plantPreviewModels: PlantPreviewModel[] = queriedSnapshots.map((plantDoc) => {
			const { images, ...plantData } = plantDoc.data() as IPlantPreviewModel;
			const imageURLS = this.listPlantImagesURLs(plantDoc.id, images ?? []);
			return new PlantPreviewModel({ ...plantData, images: imageURLS, id: plantDoc.id });
		});

		return {
			hasMore: listSnapshot.size > plantPreviewModels.length,
			plantPreviewModels,
		};
	}

	async create(plantEntity: IPlantEntity) {
		const { images, ...plantData } = plantEntity;

		const newPlantDocRef = db.collection(this.colletionName).doc();

		await ((images: Express.Multer.File[] | undefined) => {
			if (!images) return [] as string[];
			return this.storeImages(newPlantDocRef.id, images);
		})(images);

		const plantModel = new PlantModel({
			...plantData,
			images: images ? images.map((file) => file.filename || file.originalname) : [],
			id: newPlantDocRef.id,
		});

		const { id, ...plantModelData } = plantModel.export();

		await newPlantDocRef.set(plantModelData);

		return plantModel;
	}

	listPlantImagesURLs(plantId: string, images: string[]) {
		const bucket = storage.bucket();
		const folderPublicURL = bucket.file(`${this.storageName}/${plantId}`).publicUrl();
		return images.map((imageName) => `${folderPublicURL}/${imageName}`);
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
