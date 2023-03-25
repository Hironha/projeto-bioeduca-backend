import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Validator } from "@utils/validator";

import {
	type ICreatePlantInformationDTOInput,
	type ICreatePlantInformationDTOOutput,
} from "@business/interfaces/ios/plantInformation/createPlantInformation";

export class CreatePlantInformationDTO
	extends Validator
	implements ICreatePlantInformationDTOInput
{
	@IsString()
	@IsNotEmpty()
	field_name: string;

	@IsString()
	@IsNotEmpty()
	description: string;

	@IsNumber()
	@IsNotEmpty()
	order: number;

	constructor(input: ICreatePlantInformationDTOInput) {
		super();
		this.order = input.order;
		this.field_name = input.field_name;
		this.description = input.description;
	}

	export(): ICreatePlantInformationDTOOutput {
		const currTimestamp = new Date().getTime();

		return {
			field_name: this.field_name.trim(),
			description: this.description.trim(),
			order: this.order,
			created_at: currTimestamp,
			updated_at: currTimestamp,
		};
	}
}
