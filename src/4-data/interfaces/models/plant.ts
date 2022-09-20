export type PlantModelFields = { [field_name: string]: any };

export interface IPlantModel {
	id: string;
	images?: string[];
	additional_informations: PlantModelFields;
	created_at: number;
	updated_at: number;
}

export interface IStoredPlantModel extends Omit<IPlantModel, "id"> {}
