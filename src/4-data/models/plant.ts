import type {
	FormattedPlantModel,
	IPlantModel,
	PlantModelFields,
} from "@data/interfaces/models/plant";

export class PlantModel implements IPlantModel {
	id: string;
	images?: string[];
	fields: PlantModelFields;
	created_at: number;
	updated_at: number;

	constructor({ id, created_at, fields, updated_at, images }: IPlantModel) {
		this.id = id;
		this.images = images;
		this.fields = fields;
		this.created_at = created_at;
		this.updated_at = updated_at;
	}

	export(): IPlantModel {
		return {
			id: this.id,
			images: this.images,
			fields: this.fields,
			created_at: this.created_at,
			updated_at: this.updated_at,
		};
	}

	format(): FormattedPlantModel {
		return {
			id: this.id,
			images: this.images,
			updated_at: this.updated_at,
			created_at: this.created_at,
			plant_informations: {
				...this.fields,
			},
		};
	}
}
