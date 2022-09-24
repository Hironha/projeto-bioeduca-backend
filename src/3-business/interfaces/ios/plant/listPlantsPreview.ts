import { type IPlantPreviewModel } from "@data/interfaces/models/plant";

export interface IListPlantsPreviewDTOInput {
	lastKey?: string;
	perPage: string;
}

export interface IListPlantsPreviewDTOOutput {
	lastKey?: string;
	perPage: number;
}

export interface IListPlantsPreviewOutput {
	lastKey?: string;
	hasMore: boolean;
	data: IPlantPreviewModel[];
}
