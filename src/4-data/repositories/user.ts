import { auth } from "firebase-admin";

import { UserModel } from "@data/models/user";
import { type IUserEntity } from "@data/interfaces/entities/user";

export class UserRepository {
	public async createUser(userEntity: IUserEntity) {
		await auth().createUser({
			...userEntity,
		});

		return new UserModel({ ...userEntity });
	}
}
