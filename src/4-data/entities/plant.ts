import type { IPlantEntity } from "@data/interfaces/entities/plant";

export class PlantEntity implements IPlantEntity {
	popular_name: string;
	scientific_name: string;
	images?: Express.Multer.File[];
	additional_informations: IPlantEntity["additional_informations"];
	created_at: number;
	updated_at: number;

	constructor({
		images,
		created_at,
		updated_at,
		popular_name,
		scientific_name,
		additional_informations,
	}: IPlantEntity) {
		this.popular_name = popular_name;
		this.scientific_name = scientific_name;
		this.additional_informations = additional_informations;
		this.images = images;
		this.created_at = created_at;
		this.updated_at = updated_at;
	}

	export(): IPlantEntity {
		return {
			popular_name: this.popular_name,
			scientific_name: this.scientific_name,
			additional_informations: this.additional_informations,
			images: this.images,
			created_at: this.created_at,
			updated_at: this.updated_at,
		};
	}
}
