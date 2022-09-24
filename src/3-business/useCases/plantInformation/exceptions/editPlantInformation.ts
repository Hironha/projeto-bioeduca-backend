import { Exception } from "@utils/exception";

class EditPlantInformatioExceptionsFactory {
	get default() {
		return new Exception({ code: "EPI-001", httpStatus: 500, message: "Something went wrong." });
	}

	get inputValidation() {
		return new Exception({
			code: "EPI-002",
			httpStatus: 400,
			message: "Some or all the inputs are invalid.",
		});
	}

	get plantInformationNotFound() {
		return new Exception({
			code: "EPI-003",
			httpStatus: 404,
			message: "Plant informaiton not found in database.",
		});
	}

	get dbError() {
		return new Exception({
			code: "EPI-010",
			httpStatus: 500,
			message: "Something went wrong when trying to access the database.",
		});
	}
}

export const editPlantInformationException = new EditPlantInformatioExceptionsFactory();
