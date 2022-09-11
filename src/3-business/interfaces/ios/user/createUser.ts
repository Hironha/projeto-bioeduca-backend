import { type IUserEntity } from "@data/interfaces/entities/user";

export interface ICreateUserDTOInput extends IUserEntity {
	password: string;
}

export interface ICreateUserDTOOuput extends ICreateUserDTOInput {}

export interface ICreateUserOutput {}
