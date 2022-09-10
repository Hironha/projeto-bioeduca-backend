import { Validator } from "@utils/validator";
import { ImageArray } from "@utils/validations/imageArray";

import type { ICreatePlantDTOInput } from "@business/interfaces/ios/plant/createPlant";

import type { PlantEntityFields } from "@data/interfaces/entities/plant";
import { IsObject, IsOptional } from "class-validator";

export class CreatePlantDTO
	extends Validator<ICreatePlantDTOInput>
	implements ICreatePlantDTOInput
{
	@IsOptional()
	@IsObject()
	additional_informations: PlantEntityFields;

	@ImageArray({ maxCount: 5, mime: ["image/jpeg", "image/jpg", "image/png"] })
	images?: Express.Multer.File[];

	constructor(input: ICreatePlantDTOInput) {
		super(input);
	}

	export(): ICreatePlantDTOInput {
		return {
			additional_informations: this.additional_informations,
			images: this.images,
		};
	}
}
