import { db } from "@utils/database";

import { PlantInformationModel } from "@data/models/plantInformation";
import { type IPlantInformationEntity } from "@data/interfaces/entities/plantInformation";
import { type IListPaginatedEntityInput } from "@data/interfaces/entities/listPaginatedInput";
import { type IPlantInformationModel } from "@data/interfaces/models/plantInformation";

export class PlantInformationRepository {
	private readonly plantInformationsCollection = "plant-informations";

	constructor() {}

	async create(entity: IPlantInformationEntity) {
		db.collection(this.plantInformationsCollection);

		const newDocRef = db.collection(this.plantInformationsCollection).doc();
		await new Promise((resolve, reject) => {
			db.runTransaction(async (transaction) => {
				const docRef = await transaction.get(
					db
						.collection(this.plantInformationsCollection)
						.where("field_name", "==", entity.field_name)
						.limit(1)
				);
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

	async list(_entity: IListPaginatedEntityInput) {
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

	async edit(
		id: string,
		editData: Partial<IPlantInformationEntity>
	): Promise<PlantInformationModel> {
		const docRef = db.collection(this.plantInformationsCollection).doc(id);
		const snapshot = await docRef.get();
		if (!snapshot.exists) throw { code: "not-exists" };
		await docRef.set({ ...editData });
		const snapshotData = snapshot.data();
		if (!snapshotData) throw { code: "not-exists" };
		const storedPlantInformation = snapshotData as Omit<IPlantInformationModel, "id">;
		return new PlantInformationModel({ ...storedPlantInformation, id: docRef.id });
	}
}
