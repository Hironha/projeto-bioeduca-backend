import { IsNotEmpty, IsOptional, IsString } from "class-validator";

import { Validator } from "@utils/validator";
import { NumberString } from "@utils/validations/NumberString";

import {
	type IListPlantsPreviewDTOInput,
	type IListPlantsPreviewDTOOutput,
} from "@business/interfaces/ios/plant/listPlantsPreview";

export class ListPlantsPreviewDTO extends Validator implements IListPlantsPreviewDTOInput {
	@IsOptional()
	@IsString()
	lastKey?: string;

	@IsNotEmpty()
	@IsString()
	@NumberString({ isInteger: true, min: 1, max: 20 })
	perPage: string;

	constructor(input: IListPlantsPreviewDTOInput) {
		super();
		this.lastKey = input.lastKey;
		this.perPage = input.perPage;
	}

	export(): IListPlantsPreviewDTOOutput {
		return { perPage: parseInt(this.perPage), lastKey: this.lastKey };
	}
}
