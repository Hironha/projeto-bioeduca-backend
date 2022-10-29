import { PlantModel } from "@data/models/plant";
import { PlantPreviewModel } from "@data/models/plantPreview";
import { type IPlantEntity } from "@data/interfaces/entities/plant";
import { type IListPaginatedEntityInput } from "@data/interfaces/entities/listPaginatedInput";

import { PlantBucket } from "./bucket/plantBucket";
import { ListPlantsMethod } from "./methods/listPlants";
import { ConsultPlantMethod } from "./methods/consultPlant";
import { CreatePlantMethod } from "./methods/createPlant";
import { UpdatePlantMethod } from "./methods/updatePlant";
import { DeletePlantMethod } from "./methods/deletePlant";

export class PlantRepository {
	private readonly collectionName = "plants";
	private readonly storageName = "plants";

	private bucket: PlantBucket;
	private consultPlantMethod: ConsultPlantMethod;
	private listPlantsMethod: ListPlantsMethod;
	private createPlantMethod: CreatePlantMethod;
	private updatePlantMethod: UpdatePlantMethod;
	private deletePlantMethod: DeletePlantMethod;

	constructor() {
		this.consultPlantMethod = new ConsultPlantMethod(this.collectionName);
		this.listPlantsMethod = new ListPlantsMethod(this.collectionName);
		this.createPlantMethod = new CreatePlantMethod(this.collectionName);
		this.updatePlantMethod = new UpdatePlantMethod(this.collectionName);
		this.deletePlantMethod = new DeletePlantMethod(this.collectionName);

		this.bucket = new PlantBucket(this.storageName);
	}

	async consultById(id: string) {
		return this.consultPlantMethod.consultById(id, this.bucket);
	}

	async list(listEntity: IListPaginatedEntityInput) {
		return this.listPlantsMethod.listPaginated(listEntity);
	}

	async listPreview(
		listEntity: IListPaginatedEntityInput
	): Promise<{ hasMore: boolean; plantsPreview: PlantPreviewModel[] }> {
		const { hasMore, plantsPreview } = await this.listPlantsMethod.listPreviewPaginated(listEntity);
		const mappedPlantsPreview = plantsPreview.map((model) => {
			const imageURLS = this.bucket.listPlantImagesURLs(model.id, model.images ?? []);
			return new PlantPreviewModel({ ...model.export(), images: imageURLS });
		});

		return {
			hasMore,
			plantsPreview: mappedPlantsPreview,
		};
	}

	async create(plantEntity: IPlantEntity) {
		const { images, ...plantData } = plantEntity;
		const imageNames = images?.map((image) => image.filename || image.originalname) ?? [];
		const createdPlant = await this.createPlantMethod.create({ ...plantData, images: imageNames });

		if (images) {
			await this.bucket.storeImages(createdPlant.id, images);
		}
		return createdPlant;
	}

	async deleteById(id: string): Promise<PlantModel> {
		const deletedPlant = await this.deletePlantMethod.deleteById(id);
		await this.bucket.deleteImages(deletedPlant.id, deletedPlant.images ?? []);
		return deletedPlant;
	}

	async removePlantInformationFromAll(plantInformationName: string) {
		const fieldName = `additional_informations.${plantInformationName}`;
		return this.updatePlantMethod.removeFieldFromPlants(fieldName);
	}

	async updateById(id: string, updateData: Partial<Omit<IPlantEntity, "created_at">>) {
		const { images, ...plantData } = updateData;
		const imageNames = images?.map((image) => image.filename || image.originalname) ?? [];
		const updatedPlant = await this.updatePlantMethod.updatePlant(id, {
			...plantData,
			images: imageNames,
		});

		if (images) {
			await this.bucket.deleteImages(updatedPlant.id);
			await this.bucket.storeImages(updatedPlant.id, images);
		}

		return updatedPlant;
	}
}
