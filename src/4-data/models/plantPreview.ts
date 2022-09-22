import type { IPlantPreviewModel } from "@data/interfaces/models/plant";

export class PlantPreviewModel implements IPlantPreviewModel {
	id: string;
	images?: string[];
	popular_name: string;
	scientific_name: string;

	constructor({ id, images, popular_name, scientific_name }: IPlantPreviewModel) {
		this.id = id;
		this.popular_name = popular_name;
		this.scientific_name = scientific_name;
		this.images = images;
	}

	export(): IPlantPreviewModel {
		return {
			id: this.id,
			popular_name: this.popular_name,
			scientific_name: this.scientific_name,
			images: this.images,
		};
	}
}
