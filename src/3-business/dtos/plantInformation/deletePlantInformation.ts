import { IsNotEmpty, IsString } from "class-validator";

import {
	type IDeletePlantInformationDTOInput,
	type IDeletePlantInformationDTOOutput,
} from "@business/interfaces/ios/plantInformation/deletePlantInformation";
import { Validator } from "@utils/validator";

export class DeletePlantInformationDTO
	extends Validator
	implements IDeletePlantInformationDTOInput
{
	@IsNotEmpty()
	@IsString()
	id: string;

	constructor(input: IDeletePlantInformationDTOInput) {
		super();
		this.id = input.id;
	}

	export(): IDeletePlantInformationDTOOutput {
		return {
			id: this.id,
		};
	}
}
