import { IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";

import { Validator } from "@utils/validator";
import { ImageArray } from "@utils/validations/imageArray";

import {
	type IUpdatePlantDTOInput,
	type IUpdatePlantDTOOutput,
} from "@business/interfaces/ios/plant/updatePlant";
import { type IPlantEntity } from "@data/interfaces/entities/plant";

interface ISerializedInput extends Omit<IUpdatePlantDTOInput, "additional_informations"> {
	additional_informations: string;
}

export class UpdatePlantDTO
	extends Validator<IUpdatePlantDTOInput>
	implements IUpdatePlantDTOInput
{
	@IsNotEmpty()
	@IsString()
	id: string;

	@IsOptional()
	@IsString()
	popular_name: string;

	@IsOptional()
	@IsString()
	scientific_name: string;

	@IsOptional()
	@IsObject()
	additional_informations: IPlantEntity["additional_informations"];

	@IsOptional()
	@IsString({ each: true })
	delete_images: string[];

	@ImageArray({ maxCount: 5, mime: ["image/jpeg", "image/jpg", "image/png"] })
	images?: Express.Multer.File[];

	constructor(input: Partial<IUpdatePlantDTOInput>) {
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

		return new UpdatePlantDTO({ ...input, additional_informations: additionalInformations });
	}

	export(): IUpdatePlantDTOOutput {
		return {
			id: this.id,
			images: this.images,
			popular_name: this.popular_name.trim(),
			scientific_name: this.scientific_name.trim(),
			additional_informations: this.parseAdditionalInformations(),
			updated_at: new Date().getTime(),
		};
	}

	private parseAdditionalInformations() {
		const entries = Object.entries(this.additional_informations);
		const parsedEntries = entries.map(([key, value]) => [key, value.trim()]);
		return Object.fromEntries(parsedEntries);
	}
}
