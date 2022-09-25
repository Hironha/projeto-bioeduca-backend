import { db } from "@utils/database";

import { PlantModel } from "@data/models/plant";
import { type IPlantEntity } from "@data/interfaces/entities/plant";

import { type PlantBucket } from "../bucket/plantBucket";

export class CreatePlantMethod {
	constructor(private readonly collectionName: string) {}

	async create(plantEntity: IPlantEntity, plantBucket: PlantBucket) {
		const { images, ...plantData } = plantEntity;

		const newPlantDocRef = db.collection(this.collectionName).doc();

		await ((images: Express.Multer.File[] | undefined) => {
			if (!images) return [] as string[];
			return plantBucket.storeImages(newPlantDocRef.id, images);
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
}
