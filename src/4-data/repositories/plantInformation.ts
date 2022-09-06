import { db } from "@utils/database";

import { PlantInformationEntity } from "@data/entities/plantInformation";
import { PlantInformationModel } from "@data/models/plantInformation";
import { ListPaginatedInputEntity } from "@data/entities/listPaginatedInput";
import { type IPlantInformationModel } from "@data/interfaces/models/plantInformation";

export class PlantInformationRepository {
	private readonly collection = "plant-informations";

	constructor() {}

	async create(entity: PlantInformationEntity) {
		const entityData = entity.export();
		const createdDocRef = await db.collection(this.collection).add(entityData);
		const createdPlantInformation = new PlantInformationModel({
			...entityData,
			id: createdDocRef.id,
		});

		return createdPlantInformation;
	}

	async list(entity: ListPaginatedInputEntity) {
		// const entityData = entity.export();
		const snapshot = await db.collection(this.collection).get();
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
