import { db, storage } from "@utils/database";

import { PlantModel } from "@data/models/plant";
import { type PlantEntity } from "@data/entities/plant";
import { type ListPaginatedInputEntity } from "@data/entities/listPaginatedInput";
import { type StoredPlantModel } from "@data/interfaces/models/plant";

export class PlantRepository {
	private readonly colletionName = "plants";
	private readonly storageName = "plants";

	constructor() {}

	async list(_listEntity: ListPaginatedInputEntity) {
		const snapshot = await db.collection(this.colletionName).get();
		const plantModels: PlantModel[] = snapshot.docs.map((plantDoc) => {
			const id = plantDoc.id;
			const { created_at, updated_at, ...dynamicFields } = plantDoc.data() as StoredPlantModel;
			const plant = new PlantModel({ id, created_at, updated_at, fields: dynamicFields });
			return plant;
		});

		return plantModels;
	}

	async create(plantEntity: PlantEntity) {
		const { created_at, updated_at, fields } = plantEntity.export();
		const createdPlantDoc = await db.collection(this.colletionName).add({
			created_at,
			updated_at,
			...fields,
		});
		const plantModel = new PlantModel({
			created_at,
			updated_at,
			fields,
			id: createdPlantDoc.id,
		});
		return plantModel;
	}

	async storeImages(plantId: string, images: Express.Multer.File[]) {
		await Promise.all(
			images.map(async (file) => {
				await this.storeImage(plantId, file);
			})
		);
	}

	async storeImage(plantId: string, image: Express.Multer.File) {
		const bucket = storage.bucket();
		await bucket.file(`${this.storageName}/${plantId}`).save(image.buffer, {
			public: true,
			metadata: {
				contentType: image.mimetype,
				cacheControl: "public, max-age=" + 60 * 60 * 24,
			},
		});
	}
}
