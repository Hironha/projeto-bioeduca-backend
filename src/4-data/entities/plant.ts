import type {
	FormattedPlantEntity,
	IPlantEntity,
	PlantEntityFields,
} from "@data/interfaces/entities/plant";

export class PlantEntity implements IPlantEntity {
	fields: PlantEntityFields;
	images?: Express.Multer.File[];
	created_at: number;
	updated_at: number;

	constructor({ fields, images, created_at, updated_at }: IPlantEntity) {
		this.fields = fields;
		this.images = images;
		this.created_at = created_at;
		this.updated_at = updated_at;
	}

	export(): IPlantEntity {
		return {
			fields: this.fields,
			images: this.images,
			created_at: this.created_at,
			updated_at: this.updated_at,
		};
	}

	format(): FormattedPlantEntity {
		return {
			...this.fields,
			created_at: this.created_at,
			updated_at: this.updated_at,
			images: this.images,
		};
	}
}
