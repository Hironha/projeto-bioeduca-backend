import { type IPlantModel } from "@data/interfaces/models/plant";
import { type IListPaginatedEntityInput } from "@data/interfaces/entities/listPaginatedInput";

export interface IListPlantsDTOInput {
	lastKey?: string;
	perPage: string;
}

export interface IListPlantsDTOOutput {
	lastKey?: string;
	perPage: number;
}

export interface IListPlantsInput extends IListPaginatedEntityInput {}

export interface IListPlantsOutput {
	lastKey?: string;
	hasMore: boolean;
	data: IPlantModel[];
}
