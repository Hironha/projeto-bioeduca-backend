import { type IPlantInformationModel } from "../interfaces/models/plantInformation";

export class PlantInformationModel implements IPlantInformationModel {
	id: string;
	order: number;
	field_name: string;
	description: string;
	updated_at: number;
	created_at: number;

	constructor({
		id,
		order,
		field_name,
		description,
		created_at,
		updated_at,
	}: IPlantInformationModel) {
		this.id = id;
		this.order = order;
		this.field_name = field_name;
		this.created_at = created_at;
		this.updated_at = updated_at;
		this.description = description;
	}

	export(): IPlantInformationModel {
		return {
			id: this.id,
			order: this.order,
			field_name: this.field_name,
			updated_at: this.updated_at,
			created_at: this.created_at,
			description: this.description,
		};
	}
}
