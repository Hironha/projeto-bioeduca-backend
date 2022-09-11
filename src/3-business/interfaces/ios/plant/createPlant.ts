import type { IPlantEntity } from "@data/interfaces/entities/plant";
import type { IPlantModel } from "@data/interfaces/models/plant";

export interface ICreatePlantDTOInput extends Omit<IPlantEntity, "created_at" | "updated_at"> {}

export interface ICreatePlantOutput extends IPlantModel {}
