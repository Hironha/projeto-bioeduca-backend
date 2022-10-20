import { type IPlantModel } from "../models/plant";

export interface IPlantEntity extends Omit<IPlantModel, "images" | "id"> {
	images?: Express.Multer.File[];
}
