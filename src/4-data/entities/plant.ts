import type { IPlantEntity } from "@data/interfaces/entities/plant";

export class PlantEntity implements IPlantEntity {
	additional_informations: IPlantEntity["additional_informations"];
	images?: Express.Multer.File[];
	created_at: number;
	updated_at: number;

	constructor({ additional_informations, images, created_at, updated_at }: IPlantEntity) {
		this.additional_informations = additional_informations;
		this.images = images;
		this.created_at = created_at;
		this.updated_at = updated_at;
	}

	export(): IPlantEntity {
		return {
			additional_informations: this.additional_informations,
			images: this.images,
			created_at: this.created_at,
			updated_at: this.updated_at,
		};
	}
}
