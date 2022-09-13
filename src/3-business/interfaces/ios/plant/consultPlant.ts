import { type IPlantModel } from "@data/interfaces/models/plant";

export interface IConsultPlantDTOInput {
	plantId: string;
}

export interface IConsultPlantOutput extends IPlantModel {}
