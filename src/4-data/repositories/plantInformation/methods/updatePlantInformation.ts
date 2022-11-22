import { db } from "@utils/database";

import { PlantInformationModel } from "@data/models/plantInformation";
import { type IPlantInformationEntity } from "@data/interfaces/entities/plantInformation";
import { type IStoredPlantInformationModel } from "@data/interfaces/models/plantInformation";

export class UpdatePlantInformationMethod {
	constructor(private readonly collectionName: string) {}

	async updateById(
		id: string,
		editData: Partial<IPlantInformationEntity>
	): Promise<PlantInformationModel> {
		const docRef = db.collection(this.collectionName).doc(id);
		const currentSnapshot = await docRef.get();
		if (!currentSnapshot.exists) throw { code: "not-exists" };

		await docRef.update({ ...editData });
		const editedSnapshot = await docRef.get();
		const editedSnapshoData = editedSnapshot.data();
		if (!editedSnapshoData) throw { code: "not-exists" };
		const storedPlantInformation = editedSnapshoData as IStoredPlantInformationModel;
		return new PlantInformationModel({ ...storedPlantInformation, id: docRef.id });
	}
}
