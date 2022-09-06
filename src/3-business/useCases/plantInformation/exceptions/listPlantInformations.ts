import { Exception } from "@utils/exception";

class ListPlantInformationsExceptionsFactory {
	get default() {
		return new Exception({ code: "LPI-001", httpStatus: 500, message: "Something went wrong." });
	}

	get inputValidation() {
		return new Exception({
			code: "LPI-002",
			httpStatus: 400,
			message: "Some or all the inputs are invalid.",
		});
	}

	get dbError() {
		return new Exception({
			code: "LPI-010",
			httpStatus: 500,
			message: "Something went wrong when trying to access the database.",
		});
	}
}

export const listPlantInformationsExceptions = new ListPlantInformationsExceptionsFactory();
