import { IsNotEmpty, 	IsOptional, IsString } from "class-validator";
import { Validator } from "@utils/validator";
import { NumberString } from "@utils/validations/NumberString";

import type {
	IListPlantsDTOInput,
	IListPlantsDTOOutput,
} from "@business/interfaces/ios/plant/listPlants";

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

	export(): IListPlantsDTOOutput {
		return {
			lastKey: this.lastKey,
			perPage: parseInt(this.perPage),
		};
	}
}
