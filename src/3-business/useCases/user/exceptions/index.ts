import { Exception } from "@utils/exception";

class CreateUserExceptionsFactory {
	constructor() {}

	get default() {
		return new Exception({ code: "CU-001", httpStatus: 500, message: "Something went wrong." });
	}

	get inputValidation() {
		return new Exception({
			code: "CPI-002",
			httpStatus: 400,
			message: "Some or all the inputs are invalid.",
		});
	}

	get dbError() {
		return new Exception({
			code: "CPI-010",
			httpStatus: 500,
			message: "Something went wrong when trying to access the database.",
		});
	}
}

export const createUserExceptions = new CreateUserExceptionsFactory();
