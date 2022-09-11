import { IUserModel } from "@data/interfaces/models/user";

export class UserModel implements IUserModel {
	email: string;

	constructor({ email }: IUserModel) {
		this.email = email;
	}

	export(): IUserModel {
		return {
			email: this.email,
		};
	}
}
