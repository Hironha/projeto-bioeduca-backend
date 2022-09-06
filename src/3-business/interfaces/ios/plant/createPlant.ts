import type { IPlantEntity } from "@data/interfaces/entities/plant";
import type { FormattedPlantModel } from "@data/interfaces/models/plant";

export interface ICreatePlantInput extends Omit<IPlantEntity, "created_at" | "updated_at"> {}

export interface ICreatePlantOutput extends FormattedPlantModel {}
