import { type IUserEntity } from "@data/interfaces/entities/user";

export class UserEntity implements IUserEntity {
	email: string;
	password: string;

	constructor({ email, password }: IUserEntity) {
		this.email = email;
		this.password = password;
	}

	export(): IUserEntity {
		return {
			email: this.email,
			password: this.password,
		};
	}
}
