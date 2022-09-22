import { IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";

import { Validator } from "@utils/validator";
import { ImageArray } from "@utils/validations/imageArray";

import { type ICreatePlantDTOInput } from "@business/interfaces/ios/plant/createPlant";

import { PlantEntity } from "@data/entities/plant";
import { type IPlantEntity } from "@data/interfaces/entities/plant";

interface ISerializedInput extends Omit<ICreatePlantDTOInput, "additional_informations"> {
	additional_informations: string;
}

export class CreatePlantDTO
	extends Validator<ICreatePlantDTOInput>
	implements ICreatePlantDTOInput
{
	@IsNotEmpty()
	@IsString()
	popular_name: string;

	@IsNotEmpty()
	@IsString()
	scientific_name: string;

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
			popular_name: this.popular_name.trim(),
			scientific_name: this.scientific_name.trim(),
			additional_informations: this.parseAdditionalInformations(),
			created_at: currTimestamp,
			updated_at: currTimestamp,
		});
	}

	private parseAdditionalInformations() {
		const entries = Object.entries(this.additional_informations);
		const parsedEntries = entries.map(([key, value]) => [key, value.trim()]);
		return Object.fromEntries(parsedEntries);
	}
}
