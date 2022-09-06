import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Validator } from "@utils/validator";

import { PlantInformationValidations } from "@data/interfaces/entities/plantInformation";
import { type ICreatePlantInformationInput } from "@business/interfaces/ios/plantInformation/createPlantInformation";

export class CreatePlantInformationDTO
	extends Validator<ICreatePlantInformationInput>
	implements ICreatePlantInformationInput
{
	@IsEnum(PlantInformationValidations)
	@IsNotEmpty()
	validation: PlantInformationValidations;

	@IsString()
	@IsNotEmpty()
	field_name: string;

	@IsString()
	@IsNotEmpty()
	description: string;

	constructor(input: ICreatePlantInformationInput) {
		super(input);
	}

	export(): ICreatePlantInformationInput {
		return {
			field_name: this.field_name,
			validation: this.validation,
			description: this.description,
		};
	}
}
