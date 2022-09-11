import { type IUserEntity } from "../entities/user";

export interface IUserModel extends Omit<IUserEntity, "password"> {}
