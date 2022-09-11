import { IsNotEmpty, IsOptional, IsString } from "class-validator";

import { Validator } from "@utils/validator";
import { NumberString } from "@utils/validations/NumberString";

import { type IListPlantsDTOInput } from "@business/interfaces/ios/plant/listPlants";

import { ListPaginatedInputEntity } from "@data/entities/listPaginatedInput";
export class ListPlantsDTO extends Validator<IListPlantsDTOInput> implements IListPlantsDTOInput {
	@IsOptional()
	@IsString()
	lastKey?: string;

	@IsNotEmpty()
	@IsString()
	@NumberString({ isInteger: true, min: 1, max: 20 })
	perPage: string;

	constructor(input: IListPlantsDTOInput) {
		super(input);
	}

	export(): ListPaginatedInputEntity {
		return new ListPaginatedInputEntity({ perPage: parseInt(this.perPage), lastKey: this.lastKey });
	}
}
