import { type FormattedPlantModel } from "@data/interfaces/models/plant";
import { type IListPaginatedInputEntity } from "@data/interfaces/entities/listPaginatedInput";

export interface IListPlantsDTOInput {
	perPage: string;
	page: string;
}

export interface IListPlantsDTOOutput {
	perPage: number;
	page: number;
}

export interface IListPlantsInput extends IListPaginatedInputEntity {}

export interface IListPlantsOutput {
	data: FormattedPlantModel[];
}
