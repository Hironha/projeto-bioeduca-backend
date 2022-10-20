export interface IPlantInformationModel {
	id: string;
	field_name: string;
	description: string;
	updated_at: number;
	created_at: number;
}

export interface IStoredPlantInformationModel extends Omit<IPlantInformationModel, "id"> {}
