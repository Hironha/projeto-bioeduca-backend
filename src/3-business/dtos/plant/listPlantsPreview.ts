import { IsNotEmpty, IsOptional, IsString } from "class-validator";

import { Validator } from "@utils/validator";
import { NumberString } from "@utils/validations/NumberString";

import { type IListPlantsPreviewDTOInput } from "@business/interfaces/ios/plant/listPlantsPreview";

import { ListPaginatedInputEntity } from "@data/entities/listPaginatedInput";
export class ListPlantsPreviewDTO
	extends Validator<IListPlantsPreviewDTOInput>
	implements IListPlantsPreviewDTOInput
{
	@IsOptional()
	@IsString()
	lastKey?: string;

	@IsNotEmpty()
	@IsString()
	@NumberString({ isInteger: true, min: 1, max: 20 })
	perPage: string;

	constructor(input: Partial<IListPlantsPreviewDTOInput>) {
		super(input);
	}

	export(): ListPaginatedInputEntity {
		return new ListPaginatedInputEntity({ perPage: parseInt(this.perPage), lastKey: this.lastKey });
	}
}