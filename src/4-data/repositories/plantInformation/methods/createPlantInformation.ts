import { db } from "@utils/database";

import { PlantInformationModel } from "@data/models/plantInformation";
import { type IPlantInformationEntity } from "@data/interfaces/entities/plantInformation";

export class CreatePlantInformationMethod {
	constructor(private readonly collectionName: string) {}

	async create(entity: IPlantInformationEntity): Promise<PlantInformationModel> {
		const newDocRef = db.collection(this.collectionName).doc();
		const getExistentPlantInformationQuery = db
			.collection(this.collectionName)
			.where("field_name", "==", entity.field_name)
			.limit(1);

		await new Promise((resolve, reject) => {
			db.runTransaction(async (transaction) => {
				const docRef = await transaction.get(getExistentPlantInformationQuery);
				if (docRef.empty) {
					transaction.create(newDocRef, entity);
					resolve(true);
				} else {
					reject({ code: "duplicated-field_name" });
				}
			});
		});

		const createdPlantInformation = new PlantInformationModel({ ...entity, id: newDocRef.id });

		return createdPlantInformation;
	}
}
