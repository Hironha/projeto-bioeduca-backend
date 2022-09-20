import { type IPlantInformationModel } from "../models/plantInformation";

export interface IPlantInformationEntity extends Omit<IPlantInformationModel, "id"> {}
