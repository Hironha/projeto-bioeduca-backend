import { type IPlantModel } from "@data/interfaces/models/plant";

export interface IConsultPlantDTOInput {
	plantId: string;
}

export interface IConsultPlantDTOOutput extends IConsultPlantDTOInput {}

export interface IConsultPlantOutput extends IPlantModel {}
