export type PlantEntityFields = { [field_name: string]: any };

export interface IPlantEntity {
	fields: PlantEntityFields;
	images?: Express.Multer.File[];
	created_at: number;
	updated_at: number;
}

export type FormattedPlantEntity = Omit<IPlantEntity, "fields"> & {
	[field_name: string]: any;
};
