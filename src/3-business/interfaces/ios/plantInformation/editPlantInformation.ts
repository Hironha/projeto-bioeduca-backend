import { type IPlantInformationModel } from "@data/interfaces/models/plantInformation";

export interface IEditPlantInformationDTOInput {
	id: string;
	order?: number;
	description?: string;
}

export interface IEditPlantInformationDTOOutput extends IEditPlantInformationDTOInput {
	updated_at: number;
}

export interface IEditPlantInformationOutput extends IPlantInformationModel {}
