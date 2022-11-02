import { IsNotEmpty, IsString } from "class-validator";

import { Validator } from "@utils/validator";

import {
	type IDeletePlantDTOOutput,
	type IDeletePlantDTOInput,
} from "@business/interfaces/ios/plant/deletePlant";

export class DeletePlantDTO extends Validator implements IDeletePlantDTOInput {
	@IsNotEmpty()
	@IsString()
	id: string;

	constructor(input: IDeletePlantDTOInput) {
		super();
		this.id = input.id;
	}

	export(): IDeletePlantDTOOutput {
		return {
			id: this.id,
		};
	}
}
