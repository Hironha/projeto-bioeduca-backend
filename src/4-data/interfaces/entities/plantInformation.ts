export enum PlantInformationValidations {
	STRING = "string",
}

export interface IPlantInformationEntity {
	field_name: string;
	description: string;
	validation: PlantInformationValidations;
	updated_at: number;
	created_at: number;
}
