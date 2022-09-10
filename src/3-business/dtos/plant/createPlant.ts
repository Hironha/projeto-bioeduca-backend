import { IsObject, IsOptional } from "class-validator";

import { Validator } from "@utils/validator";
import { ImageArray } from "@utils/validations/imageArray";

import type {
	ICreatePlantDTOInput,
	ICreatePlantDTOOutput,
} from "@business/interfaces/ios/plant/createPlant";

import type { PlantEntityFields } from "@data/interfaces/entities/plant";

interface ISerializedInput extends Omit<ICreatePlantDTOInput, "additional_informations"> {
	additional_informations: string;
}

export class CreatePlantDTO
	extends Validator<ICreatePlantDTOInput>
	implements ICreatePlantDTOOutput
{
	@IsOptional()
	@IsObject()
	additional_informations: PlantEntityFields;

	@ImageArray({ maxCount: 5, mime: ["image/jpeg", "image/jpg", "image/png"] })
	images?: Express.Multer.File[];

	constructor(input: Partial<ICreatePlantDTOInput>) {
		super(input);
	}

	static fromSerialized(input: Partial<ISerializedInput>) {
		const additionalInformations = ((additionalInformations?: string) => {
			if (!additionalInformations) return {};
			try {
				return JSON.parse(additionalInformations) as PlantEntityFields;
			} catch (err) {
				return {};
			}
		})(input?.additional_informations);

		return new CreatePlantDTO({ ...input, additional_informations: additionalInformations });
	}

	export(): ICreatePlantDTOOutput {
		return {
			additional_informations: this.additional_informations,
			images: this.images,
		};
	}
}
