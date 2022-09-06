import { Validator } from "@utils/validator";
import { ImageArray } from "@utils/validations/imageArray";

import type { ICreatePlantInput } from "@business/interfaces/ios/plant/createPlant";

import type { PlantEntityFields } from "@data/interfaces/entities/plant";

export class CreatePlantDTO extends Validator<ICreatePlantInput> implements ICreatePlantInput {
	fields: PlantEntityFields;

	@ImageArray({ maxCount: 5, mime: ["image/jpeg", "image/jpg", "image/png"] })
	images?: Express.Multer.File[];

	constructor(input: ICreatePlantInput) {
		super(input);
	}

	export(): ICreatePlantInput {
		return {
			fields: this.fields,
			images: this.images,
		};
	}
}
