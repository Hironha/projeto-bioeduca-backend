import { IsNotEmpty, IsString } from "class-validator";
import { Validator } from "@utils/validator";

import {
	type ICreatePlantInformationDTOInput,
	type ICreatePlantInformationDTOOutput,
} from "@business/interfaces/ios/plantInformation/createPlantInformation";

export class CreatePlantInformationDTO
	extends Validator<ICreatePlantInformationDTOInput>
	implements ICreatePlantInformationDTOInput
{
	@IsString()
	@IsNotEmpty()
	field_name: string;

	@IsString()
	@IsNotEmpty()
	description: string;

	constructor(input: ICreatePlantInformationDTOInput) {
		super();
		this.field_name = input.field_name;
		this.description = input.description;
	}

	export(): ICreatePlantInformationDTOOutput {
		const currTimestamp = new Date().getTime();

		return {
			field_name: this.field_name.trim(),
			description: this.description.trim(),

			created_at: currTimestamp,
			updated_at: currTimestamp,
		};
	}
}
