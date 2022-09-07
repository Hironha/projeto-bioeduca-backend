import { IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator";
import { Validator } from "@utils/validator";

import type {
	IListPlantsDTOInput,
	IListPlantsDTOOutput,
} from "@business/interfaces/ios/plant/listPlants";

export class ListPlantsDTO extends Validator<IListPlantsDTOInput> implements IListPlantsDTOInput {
	@IsString()
	@IsOptional()
	lastKey?: string;

	@IsNumberString({ min: 1 })
	@IsNotEmpty()
	perPage: string;

	constructor(input: IListPlantsDTOInput) {
		super(input);
	}

	export(): IListPlantsDTOOutput {
		return {
			lastKey: this.lastKey ? parseInt(this.lastKey) : undefined,
			perPage: parseInt(this.perPage),
		};
	}
}
