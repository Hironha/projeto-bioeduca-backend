import { IsEmail, IsNotEmpty, IsString } from "class-validator";

import { Validator } from "@utils/validator";

import { ICreateUserDTOInput, ICreateUserDTOOuput } from "@business/interfaces/ios/user/createUser";

export class CreateUserDTO extends Validator<ICreateUserDTOInput> implements ICreateUserDTOInput {
	@IsNotEmpty()
	@IsString()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsString()
	password: string;

	constructor(input: Partial<ICreateUserDTOInput>) {
		super(input);
	}

	export(): ICreateUserDTOOuput {
		return {
			email: this.email,
			password: this.password,
		};
	}
}
