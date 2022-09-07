import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Validator } from "@utils/validator";

import { PlantInformationValidations } from "@data/interfaces/entities/plantInformation";
import type {
	ICreatePlantInformationDTOInput,
	ICreatePlantInformationDTOOutput,
} from "@business/interfaces/ios/plantInformation/createPlantInformation";

export class CreatePlantInformationDTO
	extends Validator<ICreatePlantInformationDTOInput>
	implements ICreatePlantInformationDTOInput
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

	constructor(input: ICreatePlantInformationDTOInput) {
		super(input);
	}

	export(): ICreatePlantInformationDTOOutput {
		return {
			field_name: this.field_name,
			validation: this.validation,
			description: this.description,
		};
	}
}
