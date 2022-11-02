import { IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";

import { Validator } from "@utils/validator";
import { ImageArray } from "@utils/validations/imageArray";

import {
	type IUpdatePlantDTOInput,
	type IUpdatePlantDTOOutput,
} from "@business/interfaces/ios/plant/updatePlant";
import { type IPlantEntity } from "@data/interfaces/entities/plant";

interface ISerializedInput
	extends Omit<IUpdatePlantDTOInput, "additional_informations" | "delete_images"> {
	additional_informations: string;
	delete_images: string;
}

export class UpdatePlantDTO extends Validator implements IUpdatePlantDTOInput {
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

	constructor(input: IUpdatePlantDTOInput) {
		super();
		this.id = input.id;
		this.popular_name = input.popular_name;
		this.scientific_name = input.scientific_name;
		this.additional_informations = input.additional_informations;
		this.delete_images = input.delete_images ?? [];
		this.images = input.images;
	}

	static fromSerialized(input: ISerializedInput) {
		const additionalInformations = ((additionalInformations?: string) => {
			if (!additionalInformations) return {};
			try {
				return JSON.parse(additionalInformations) as IPlantEntity["additional_informations"];
			} catch (err) {
				return {};
			}
		})(input?.additional_informations);

		const deleteImages = ((deleteImages?: string): string[] => {
			try {
				const parsedDeleteImages = JSON.parse(deleteImages ?? "");
				return Array.isArray(parsedDeleteImages) ? parsedDeleteImages : [];
			} catch (err) {
				return [];
			}
		})(input?.delete_images);

		return new UpdatePlantDTO({
			...input,
			delete_images: deleteImages,
			additional_informations: additionalInformations,
		});
	}

	export(): IUpdatePlantDTOOutput {
		return {
			id: this.id,
			images: this.images,
			delete_images: this.delete_images,
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
