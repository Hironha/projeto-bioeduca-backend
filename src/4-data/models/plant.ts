import type {
	FormattedPlantModel,
	IPlantModel,
	PlantModelFields,
	StoredPlantModel,
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

	static fromStore(plantData: StoredPlantModel & { id: string }) {
		const { created_at, id, updated_at, ...additionalFields } = plantData;
		return new PlantModel({ created_at, id, updated_at, fields: additionalFields });
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
			additional_informations: {
				...this.fields,
			},
		};
	}
}
