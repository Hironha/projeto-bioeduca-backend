export type PlantModelFields = { [field_name: string]: string };

export interface IPlantModel {
	id: string;
	images?: string[];
	scientific_name: string;
	popular_name: string;
	additional_informations: PlantModelFields;
	created_at: number;
	updated_at: number;
}

export interface IStoredPlantModel extends Omit<IPlantModel, "id"> {}
