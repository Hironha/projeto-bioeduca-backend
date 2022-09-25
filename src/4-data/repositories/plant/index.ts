import { type IPlantEntity } from "@data/interfaces/entities/plant";
import { type IListPaginatedEntityInput } from "@data/interfaces/entities/listPaginatedInput";

import { PlantBucket } from "./bucket/plantBucket";
import { ListPlantsMethod } from "./methods/listPlants";
import { ConsultPlantMethod } from "./methods/consultPlant";
import { CreatePlantMethod } from "./methods/createPlant";
import { UpdatePlantMethod } from "./methods/updatePlant";

export class PlantRepository {
	private readonly collectionName = "plants";
	private readonly storageName = "plants";

	private bucket: PlantBucket;
	private consultPlantMethod: ConsultPlantMethod;
	private listPlantsMethod: ListPlantsMethod;
	private createPlantMethod: CreatePlantMethod;
	private updatePlantMethod: UpdatePlantMethod;

	constructor() {
		this.consultPlantMethod = new ConsultPlantMethod(this.collectionName);
		this.listPlantsMethod = new ListPlantsMethod(this.collectionName);
		this.createPlantMethod = new CreatePlantMethod(this.collectionName);
		this.updatePlantMethod = new UpdatePlantMethod(this.collectionName);

		this.bucket = new PlantBucket(this.storageName);
	}

	async consultById(id: string) {
		return this.consultPlantMethod.consultById(id, this.bucket);
	}

	async list(listEntity: IListPaginatedEntityInput) {
		return this.listPlantsMethod.listPaginated(listEntity);
	}

	async listPreview(listEntity: IListPaginatedEntityInput) {
		return this.listPlantsMethod.listPreviewPaginated(listEntity, this.bucket);
	}

	async create(plantEntity: IPlantEntity) {
		return this.createPlantMethod.create(plantEntity, this.bucket);
	}

	async removePlantInformationFromAll(plantInformationName: string) {
		const fieldName = `additional_informations.${plantInformationName}`;
		return this.updatePlantMethod.removeFieldFromPlants(fieldName);
	}
}
