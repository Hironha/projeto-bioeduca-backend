import { IsNotEmpty, IsString } from "class-validator";
import { Validator } from "@utils/validator";

import { PlantInformationEntity } from "@data/entities/plantInformation";

import type { ICreatePlantInformationDTOInput } from "@business/interfaces/ios/plantInformation/createPlantInformation";

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
		super(input);
	}

	export(): PlantInformationEntity {
		const currTimestamp = new Date().getTime();

		return new PlantInformationEntity({
			field_name: this.field_name,
			description: this.description,
			created_at: currTimestamp,
			updated_at: currTimestamp,
		});
	}
}
