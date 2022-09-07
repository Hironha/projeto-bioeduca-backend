import { IsNotEmpty, IsNumberString } from "class-validator";
import { Validator } from "@utils/validator";

import type {
	IListPlantsDTOInput,
	IListPlantsDTOOutput,
} from "@business/interfaces/ios/plant/listPlants";

export class ListPlantsDTO extends Validator<IListPlantsDTOInput> implements IListPlantsDTOInput {
	@IsNumberString({ min: 0 })
	@IsNotEmpty()
	page: string;

	@IsNumberString({ min: 0 })
	@IsNotEmpty()
	perPage: string;

	constructor(input: IListPlantsDTOInput) {
		super(input);
	}

	export(): IListPlantsDTOOutput {
		return {
			page: parseInt(this.page),
			perPage: parseInt(this.perPage),
		};
	}
}
