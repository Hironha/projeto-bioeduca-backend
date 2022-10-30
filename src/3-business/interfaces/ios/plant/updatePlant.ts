import { type IPlantModel } from "@data/interfaces/models/plant";
import { type IPlantEntity } from "@data/interfaces/entities/plant";

export interface IUpdatePlantDTOInput extends Omit<IPlantEntity, "created_at" | "updated_at"> {
	id: string;
	delete_images: string[]
}

export interface IUpdatePlantDTOOutput extends Partial<Omit<IPlantEntity, "created_at">> {
	id: string;
}

export interface IUpdatePlantOutput extends IPlantModel {}
