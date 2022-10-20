import { db } from "@utils/database";

import { PlantModel } from "@data/models/plant";
import { type IStoredPlantModel } from "@data/interfaces/models/plant";

export class DeletePlantMethod {
	constructor(private readonly collectionName: string) {}

	async deleteById(id: string): Promise<PlantModel> {
		const snapshot = await db.collection(this.collectionName).doc(id).get();
		const snapshotData = snapshot.data();
		if (!snapshotData) throw { code: "not-exists" };

		await db.collection(this.collectionName).doc(id).delete();
		const storedPlantModelData = snapshotData as IStoredPlantModel;
		const deletedPlant = new PlantModel({ ...storedPlantModelData, id: snapshot.id });
		return deletedPlant;
	}
}
