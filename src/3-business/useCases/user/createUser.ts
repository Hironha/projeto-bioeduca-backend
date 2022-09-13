import { Exception } from "@utils/exception";
import { Left, Right, type Either } from "@utils/flow";

import { CreateUserDTO } from "@business/dtos/user/createUser";
import { type ICreateUserOutput } from "@business/interfaces/ios/user/createUser";

import { UserRepository } from "@data/repositories/user";
import { UserEntity } from "@data/entities/user";
import { type UserModel } from "@data/models/user";

import { createUserExceptions as exceptions } from "./exceptions";

export class CreateUserUseCase {
	constructor(private userRepository = new UserRepository()) {}

	async exec(input: CreateUserDTO): Promise<ICreateUserOutput> {
		try {
			const getUserEntityFlow = await this.getUserEntity(input);
			if (getUserEntityFlow.isLeft()) throw getUserEntityFlow.export();
			const userEntity = getUserEntityFlow.export();

			const createUserFlow = await this.createUser(userEntity);
			if (createUserFlow.isLeft()) throw createUserFlow.export();

			return {};
		} catch (err) {
			console.error(err);
			if (err instanceof Exception) throw err;
			throw exceptions.default;
		}
	}

	async createUser(userEntity: UserEntity): Promise<Either<Exception, UserModel>> {
		try {
			const userModel = await this.userRepository.createUser(userEntity);
			return new Right(userModel);
		} catch (err: any) {
			const code = err?.errorInfo?.code;
			if (code === "auth/email-already-exists") return new Left(exceptions.emailAlreadyExists);
			return new Left(exceptions.dbError);
		}
	}

	async getUserEntity(dto: CreateUserDTO): Promise<Either<Exception, UserEntity>> {
		try {
			await dto.validate();
			const dtoData = dto.export();
			return new Right(new UserEntity(dtoData));
		} catch (err) {
			const message = (err as Error).message;
			return new Left(exceptions.inputValidation.edit({ message }));
		}
	}
}
