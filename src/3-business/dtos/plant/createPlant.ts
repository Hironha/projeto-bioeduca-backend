import { IsObject, IsOptional } from "class-validator";

import { Validator } from "@utils/validator";
import { ImageArray } from "@utils/validations/imageArray";

import { type ICreatePlantDTOInput } from "@business/interfaces/ios/plant/createPlant";

import { IPlantEntity } from "@data/interfaces/entities/plant";
import { PlantEntity } from "@data/entities/plant";

interface ISerializedInput extends Omit<ICreatePlantDTOInput, "additional_informations"> {
	additional_informations: string;
}

export class CreatePlantDTO
	extends Validator<ICreatePlantDTOInput>
	implements ICreatePlantDTOInput
{
	@IsOptional()
	@IsObject()
	additional_informations: IPlantEntity["additional_informations"];

	@ImageArray({ maxCount: 5, mime: ["image/jpeg", "image/jpg", "image/png"] })
	images?: Express.Multer.File[];

	constructor(input: Partial<ICreatePlantDTOInput>) {
		super(input);
	}

	static fromSerialized(input: Partial<ISerializedInput>) {
		const additionalInformations = ((additionalInformations?: string) => {
			if (!additionalInformations) return {};
			try {
				return JSON.parse(additionalInformations) as IPlantEntity["additional_informations"];
			} catch (err) {
				return {};
			}
		})(input?.additional_informations);

		return new CreatePlantDTO({ ...input, additional_informations: additionalInformations });
	}

	export(): PlantEntity {
		const currTimestamp = new Date().getTime();
		return new PlantEntity({
			images: this.images,
			additional_informations: this.additional_informations,
			created_at: currTimestamp,
			updated_at: currTimestamp,
		});
	}
}
