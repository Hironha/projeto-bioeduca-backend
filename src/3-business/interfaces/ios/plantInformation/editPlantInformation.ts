import { type IPlantInformationModel } from "@data/interfaces/models/plantInformation";
import type { IPlantInformationEntity } from "@data/interfaces/entities/plantInformation";

export interface IEditPlantInformationDTOInput
	extends Omit<IPlantInformationEntity, "created_at" | "updated_at" | "field_name"> {
	id: string;
}

export interface IEditPlantInformationDTOOutput
	extends Omit<IPlantInformationEntity, "created_at" | "field_name"> {
	id: string;
}

export interface IEditPlantInformationOutput extends IPlantInformationModel {}
