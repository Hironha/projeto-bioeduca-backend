import type { IPlantEntity } from "../entities/plant";

export type PlantModelFields = { [field_name: string]: any };

export interface IPlantModel extends Omit<IPlantEntity, "fields" | "images"> {
	id: string;
	images?: string[];
	additional_informations: PlantModelFields;
}

export interface IStoredPlantModel extends Omit<IPlantModel, "id"> {}
