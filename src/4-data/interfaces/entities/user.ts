import { type IUserModel } from "../models/user";

export interface IUserEntity extends IUserModel {
	password: string;
}
