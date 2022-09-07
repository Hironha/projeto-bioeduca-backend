import { db } from "@utils/database";

import { PlantInformationEntity } from "@data/entities/plantInformation";
import { PlantInformationModel } from "@data/models/plantInformation";
import { ListPaginatedInputEntity } from "@data/entities/listPaginatedInput";
import { type IPlantInformationModel } from "@data/interfaces/models/plantInformation";

export class PlantInformationRepository {
	private readonly plantInformationsCollection = "plant-informations";

	constructor() {}

	async create(entity: PlantInformationEntity) {
		const entityData = entity.export();
		db.collection(this.plantInformationsCollection);

		const newDocRef = db.collection(this.plantInformationsCollection).doc();
		await new Promise((resolve, reject) => {
			db.runTransaction(async (transaction) => {
				const docRef = await transaction.get(
					db
						.collection(this.plantInformationsCollection)
						.where("field_name", "==", entityData.field_name)
						.limit(1)
				);
				if (docRef.empty) {
					transaction.create(newDocRef, entityData);
					resolve(true);
				} else {
					reject({ code: "duplicated-field_name" });
				}
			});
		});

		const createdPlantInformation = new PlantInformationModel({ ...entityData, id: newDocRef.id });

		return createdPlantInformation;
	}

	async list(_entity: ListPaginatedInputEntity) {
		// const entityData = entity.export();
		const snapshot = await db.collection(this.plantInformationsCollection).get();
		const plantInformations: PlantInformationModel[] = [];
		snapshot.docs.forEach((doc) => {
			const id = doc.id;
			const data = doc.data() as Omit<IPlantInformationModel, "id">;
			const plantInformation = new PlantInformationModel({ id, ...data });
			plantInformations.push(plantInformation);
		});

		return plantInformations;
	}
}
