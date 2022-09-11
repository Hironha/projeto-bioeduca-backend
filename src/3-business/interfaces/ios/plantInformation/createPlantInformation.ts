import { type IPlantInformationModel } from "@data/interfaces/models/plantInformation";
import type { IPlantInformationEntity } from "@data/interfaces/entities/plantInformation";

export interface ICreatePlantInformationDTOInput
	extends Omit<IPlantInformationEntity, "created_at" | "updated_at"> {}

export interface ICreatePlantInformationOutput extends IPlantInformationModel {}
