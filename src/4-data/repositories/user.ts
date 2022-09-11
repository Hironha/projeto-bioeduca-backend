import { auth } from "firebase-admin";

import { UserModel } from "@data/models/user";
import { type UserEntity } from "@data/entities/user";

export class UserRepository {
	public async createUser(userEntity: UserEntity) {
		const userData = userEntity.export();

		await auth().createUser({
			...userData,
		});

		return new UserModel({ ...userData });
	}
}
