import { type IPlantInformationEntity } from "../interfaces/entities/plantInformation";

export class PlantInformationEntity implements IPlantInformationEntity {
	field_name: string;
	created_at: number;
	updated_at: number;
	description: string;

	constructor({ field_name, description, created_at, updated_at }: IPlantInformationEntity) {
		this.field_name = field_name;
		this.created_at = created_at;
		this.updated_at = updated_at;
		this.description = description;
	}

	export(): IPlantInformationEntity {
		return {
			field_name: this.field_name,
			updated_at: this.updated_at,
			created_at: this.created_at,
			description: this.description,
		};
	}
}
