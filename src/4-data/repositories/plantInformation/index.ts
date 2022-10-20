import { type IPlantInformationEntity } from "@data/interfaces/entities/plantInformation";

import { CreatePlantInformationMethod } from "./methods/createPlantInformation";
import { DeletePlantInformationMethod } from "./methods/deletePlantInformation";
import { ListPlantInformationsMethod } from "./methods/listPlantInformations";
import { UpdatePlantInformationMethod } from "./methods/updatePlantInformation";

export class PlantInformationRepository {
	private readonly collectionName = "plant-informations";

	private createPlantInformationMethod: CreatePlantInformationMethod;
	private listPlantsInformationMethod: ListPlantInformationsMethod;
	private deletePlantInformationMethod: DeletePlantInformationMethod;
	private updatePlantInformationMethod: UpdatePlantInformationMethod;

	constructor() {
		this.createPlantInformationMethod = new CreatePlantInformationMethod(this.collectionName);
		this.listPlantsInformationMethod = new ListPlantInformationsMethod(this.collectionName);
		this.deletePlantInformationMethod = new DeletePlantInformationMethod(this.collectionName);
		this.updatePlantInformationMethod = new UpdatePlantInformationMethod(this.collectionName);
	}

	async create(entity: IPlantInformationEntity) {
		return await this.createPlantInformationMethod.create(entity);
	}

	async listAll() {
		return await this.listPlantsInformationMethod.list();
	}

	async deleteById(id: string) {
		return await this.deletePlantInformationMethod.deleteById(id);
	}

	async updateById(id: string, updateEntity: Partial<IPlantInformationEntity>) {
		return await this.updatePlantInformationMethod.updateById(id, updateEntity);
	}
}
