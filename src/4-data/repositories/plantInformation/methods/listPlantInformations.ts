import { db } from "@utils/database";

import { PlantInformationModel } from "@data/models/plantInformation";
import { type IStoredPlantInformationModel } from "@data/interfaces/models/plantInformation";

export class ListPlantInformationsMethod {
	constructor(private readonly collectionName: string) {}

	async list(): Promise<PlantInformationModel[]> {
		const snapshot = await db.collection(this.collectionName).get();

		const plantInformations = snapshot.docs.map((doc) => {
			const id = doc.id;
			const data = doc.data() as IStoredPlantInformationModel;
			return new PlantInformationModel({ id, ...data });
		});

		return plantInformations;
	}
}
