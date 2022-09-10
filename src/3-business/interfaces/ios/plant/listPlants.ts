import { type IPlantModel } from "@data/interfaces/models/plant";

export interface IListPlantsDTOInput {
	lastKey?: string;
	perPage: string;
}

export interface IListPlantsDTOOutput {
	lastKey?: string;
	perPage: number;
}

export interface IListPlantsOutput {
	lastKey?: string;
	hasMore: boolean;
	data: IPlantModel[];
}
