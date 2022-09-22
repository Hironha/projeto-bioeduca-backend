import type { IPlantModel, PlantModelFields } from "@data/interfaces/models/plant";

export class PlantModel implements IPlantModel {
	id: string;
	images?: string[];
	popular_name: string;
	scientific_name: string;
	additional_informations: PlantModelFields;
	created_at: number;
	updated_at: number;

	constructor({
		id,
		created_at,
		additional_informations,
		updated_at,
		images,
		popular_name,
		scientific_name,
	}: IPlantModel) {
		this.id = id;
		this.popular_name = popular_name;
		this.scientific_name = scientific_name;
		this.images = images;
		this.created_at = created_at;
		this.updated_at = updated_at;
		this.additional_informations = additional_informations;
	}

	export(): IPlantModel {
		return {
			id: this.id,
			popular_name: this.popular_name,
			scientific_name: this.scientific_name,
			images: this.images,
			created_at: this.created_at,
			updated_at: this.updated_at,
			additional_informations: this.additional_informations,
		};
	}
}
