import { type FormattedPlantModel } from "@data/interfaces/models/plant";

export interface IListPlantsInput {}

export interface IListPlantsOutput {
	data: FormattedPlantModel[];
}
