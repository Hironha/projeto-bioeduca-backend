import { IPlantEntity } from "../entities/plant";

export type PlantModelFields = { [field_name: string]: any };

export interface IPlantModel extends Omit<IPlantEntity, "fields" | "images"> {
	id: string;
	images?: string[]
	fields: PlantModelFields;
}

export type StoredPlantModel = Omit<IPlantModel, "fields" | 'id' | 'images'> & {
	[field_name: string]: any;
};

export type FormattedPlantModel = Omit<IPlantModel, "fields"> & {
	plant_informations: {
		[field_name: string]: any;
	};
};
