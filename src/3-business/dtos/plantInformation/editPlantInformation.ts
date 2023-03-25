import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
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
	description?: string;

	@IsNumber()
	@IsOptional()
	order?: number;

	constructor(input: IEditPlantInformationDTOInput) {
		super();
		this.id = input.id;
		this.order = input.order;
		this.description = input.description;
	}

	export(): IEditPlantInformationDTOOutput {
		const currTimestamp = new Date().getTime();

		return {
			id: this.id,
			order: this.order,
			description: this.description?.trim(),
			updated_at: currTimestamp,
		};
	}
}
