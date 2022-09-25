import { type IPlantEntity } from "@data/interfaces/entities/plant";
import { type IListPaginatedEntityInput } from "@data/interfaces/entities/listPaginatedInput";

import { PlantBucket } from "./bucket/plantBucket";
import { ListPlants } from "./methods/listPlants";
import { ConsultPlant } from "./methods/consultPlant";
import { CreatePlant } from "./methods/createPlant";
import { UpdatePlant } from "./methods/updatePlant";

export class PlantRepository {
	private readonly collectionName = "plants";
	private readonly storageName = "plants";

	private bucket: PlantBucket;
	private consultPlantMethod: ConsultPlant;
	private listPlants: ListPlants;
	private createPlant: CreatePlant;
	private updatePlant: UpdatePlant;

	constructor() {
		this.consultPlantMethod = new ConsultPlant(this.collectionName);
		this.listPlants = new ListPlants(this.collectionName);
		this.createPlant = new CreatePlant(this.collectionName);
		this.updatePlant = new UpdatePlant(this.collectionName);

		this.bucket = new PlantBucket(this.storageName);
	}

	async consultPlantById(id: string) {
		return this.consultPlantMethod.consultById(id, this.bucket);
	}

	async list(listEntity: IListPaginatedEntityInput) {
		return this.listPlants.listPaginated(listEntity);
	}

	async listPreview(listEntity: IListPaginatedEntityInput) {
		return this.listPlants.listPreviewPaginated(listEntity, this.bucket);
	}

	async create(plantEntity: IPlantEntity) {
		return this.createPlant.create(plantEntity, this.bucket);
	}

	async removePlantInformationFromAll(plantInformationName: string) {
		const fieldName = `additional_informations.${plantInformationName}`;
		return this.updatePlant.removeFieldFromPlants(fieldName);
	}
}
