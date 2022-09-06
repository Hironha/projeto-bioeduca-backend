import { type IPlantInformationModel } from "@data/interfaces/models/plantInformation";

export interface IListPlantInformationsInput {}

export interface IListPlantInformationsOutput {
	data: IPlantInformationModel[];
}
