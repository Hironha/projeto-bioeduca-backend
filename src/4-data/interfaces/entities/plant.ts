export type PlantEntityFields = { [field_name: string]: any };

export interface IPlantEntity {
	additional_informations: PlantEntityFields;
	images?: Express.Multer.File[];
	created_at: number;
	updated_at: number;
}
