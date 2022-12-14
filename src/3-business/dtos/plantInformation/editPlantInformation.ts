import { IsNotEmpty, IsString } from "class-validator";
import { Validator } from "@utils/validator";

import {
	type IEditPlantInformationDTOInput,
	type IEditPlantInformationDTOOutput,
} from "@business/interfaces/ios/plantInformation/editPlantInformation";

export class EditPlantInformationDTO extends Validator implements IEditPlantInformationDTOInput {
	@IsNotEmpty()
	@IsString()
	id: string;

	@IsString()
	@IsNotEmpty()
	description: string;

	constructor(input: IEditPlantInformationDTOInput) {
		super();
		this.id = input.id;
		this.description = input.description;
	}

	export(): IEditPlantInformationDTOOutput {
		const currTimestamp = new Date().getTime();

		return {
			id: this.id,
			description: this.description.trim(),
			updated_at: currTimestamp,
		};
	}
}
