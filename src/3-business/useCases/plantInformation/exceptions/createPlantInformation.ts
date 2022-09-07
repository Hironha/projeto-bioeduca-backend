import { Exception } from "@utils/exception";

class CreatePlantInformationExceptionsFactory {
	get default() {
		return new Exception({ code: "CPI-001", httpStatus: 500, message: "Something went wrong." });
	}

	get inputValidation() {
		return new Exception({
			code: "CPI-002",
			httpStatus: 400,
			message: "Some or all the inputs are invalid.",
		});
	}

	get duplicatedFieldName() {
		return new Exception({
			code: "CPI-003",
			httpStatus: 500,
			message: "Could not create plant information because field_name is already used."
		})
	}

	get dbError() {
		return new Exception({
			code: "CPI-010",
			httpStatus: 500,
			message: "Something went wrong when trying to access the database.",
		});
	}
}

export const createPlantInformationExceptions = new CreatePlantInformationExceptionsFactory();
