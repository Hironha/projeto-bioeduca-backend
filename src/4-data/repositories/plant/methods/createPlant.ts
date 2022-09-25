import { db } from "@utils/database";

import { PlantModel } from "@data/models/plant";
import { type IStoredPlantModel } from "@data/interfaces/models/plant";

export class CreatePlantMethod {
	constructor(private readonly collectionName: string) {}

	private createPlantDoc() {
		return db.collection(this.collectionName).doc();
	}

	async create(plantData: IStoredPlantModel) {
		const newPlantDocRef = this.createPlantDoc();

		const plantModel = new PlantModel({
			...plantData,
			id: newPlantDocRef.id,
		});

		const { id, ...plantModelData } = plantModel.export();
		await newPlantDocRef.set(plantModelData);

		return plantModel;
	}
}
