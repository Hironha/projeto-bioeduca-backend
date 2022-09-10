import type {
	IPlantModel,
	PlantModelFields,
	IStoredPlantModel,
} from "@data/interfaces/models/plant";

export class PlantModel implements IPlantModel {
	id: string;
	images?: string[];
	additional_informations: PlantModelFields;
	created_at: number;
	updated_at: number;

	constructor({ id, created_at, additional_informations, updated_at, images }: IPlantModel) {
		this.id = id;
		this.images = images;
		this.created_at = created_at;
		this.updated_at = updated_at;
		this.additional_informations = additional_informations;
	}

	static fromStore(plantData: IStoredPlantModel & { id: string }) {
		return new PlantModel(plantData);
	}

	export(): IPlantModel {
		return {
			id: this.id,
			images: this.images,
			created_at: this.created_at,
			updated_at: this.updated_at,
			additional_informations: this.additional_informations,
		};
	}
}
