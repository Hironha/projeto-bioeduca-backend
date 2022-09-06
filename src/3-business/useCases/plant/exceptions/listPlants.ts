import { Exception } from "@utils/exception";

class ListPlantsExceptionsFactory {
	constructor() {}

	get default() {
		return new Exception({ code: "LP-001", httpStatus: 500, message: "Something went wrong." });
	}

	get inputValidation() {
		return new Exception({
			code: "LP-002",
			httpStatus: 400,
			message: "Some or all the inputs are invalid.",
		});
	}

	get dbError() {
		return new Exception({
			code: "LP-010",
			httpStatus: 500,
			message: "Something went wrong when trying to access the database.",
		});
	}
}

export const listPlantsExceptions = new ListPlantsExceptionsFactory();
