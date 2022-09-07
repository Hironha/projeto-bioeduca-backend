import { Validator } from "@utils/validator";
import { ImageArray } from "@utils/validations/imageArray";

import type {
	ICreatePlantDTOInput,
	ICreatePlantDTOOutput,
} from "@business/interfaces/ios/plant/createPlant";

import type { PlantEntityFields } from "@data/interfaces/entities/plant";

export class CreatePlantDTO
	extends Validator<ICreatePlantDTOOutput>
	implements ICreatePlantDTOOutput
{
	fields: PlantEntityFields;

	@ImageArray({ maxCount: 5, mime: ["image/jpeg", "image/jpg", "image/png"] })
	images?: Express.Multer.File[];

	constructor(input: ICreatePlantDTOOutput) {
		super(input);
	}

	export(): ICreatePlantDTOInput {
		return {
			fields: this.fields,
			images: this.images,
		};
	}
}
