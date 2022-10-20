import { db } from "@utils/database";

import { PlantInformationModel } from "@data/models/plantInformation";
import { IStoredPlantInformationModel } from "@data/interfaces/models/plantInformation";

export class DeletePlantInformationMethod {
	constructor(private readonly collectionName: string) {}

	async deleteById(id: string): Promise<PlantInformationModel> {
		const docRef = db.collection(this.collectionName).doc(id);
		const snapshot = await docRef.get();
		const snapshotData = snapshot.data();

		if (!snapshotData) throw { code: "not-exists" };

		const plantInformationData = snapshotData as IStoredPlantInformationModel;
		const plantInformation = new PlantInformationModel({ ...plantInformationData, id: docRef.id });

		if (!snapshot.exists) throw { code: "not-exists" };

		await docRef.delete();

		return plantInformation;
	}
}
