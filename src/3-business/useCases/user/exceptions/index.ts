import { Exception } from "@utils/exception";

class CreateUserExceptionsFactory {
	constructor() {}

	get default() {
		return new Exception({ code: "CUR-001", httpStatus: 500, message: "Something went wrong." });
	}

	get inputValidation() {
		return new Exception({
			code: "CUR-002",
			httpStatus: 400,
			message: "Some or all the inputs are invalid.",
		});
	}

	get dbError() {
		return new Exception({
			code: "CUR-010",
			httpStatus: 500,
			message: "Something went wrong when trying to access the database.",
		});
	}

	get emailAlreadyExists() {
		return new Exception({
			code: "CUR-011",
			httpStatus: 500,
			message: "The email address is already in use by another account.",
		});
	}
}

export const createUserExceptions = new CreateUserExceptionsFactory();
