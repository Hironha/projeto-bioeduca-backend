import { type IPlantInformationModel } from "../interfaces/models/plantInformation";

export class PlantInformationModel implements IPlantInformationModel {
	id: string;
	updated_at: number;
	created_at: number;
	field_name: string;
	description: string;

	constructor({ id, field_name, description, created_at, updated_at }: IPlantInformationModel) {
		this.id = id;
		this.field_name = field_name;
		this.created_at = created_at;
		this.updated_at = updated_at;
		this.description = description;
	}

	export(): IPlantInformationModel {
		return {
			id: this.id,
			field_name: this.field_name,
			updated_at: this.updated_at,
			created_at: this.created_at,
			description: this.description,
		};
	}
}
