import { Exception } from "@utils/exception";
import { Controller } from "@utils/controller";

import { DeletePlantInformationDTO } from "@business/dtos/plantInformation/deletePlantInformation";
import { DeletePlantInformationUseCase } from "@business/useCases/plantInformation/deletePlantInformation";
import { type ParsedQs } from "qs";
import { type ParamsDictionary } from "express-serve-static-core";
import { type Request, type Response, type NextFunction } from "express";

export class DeletePlantInformationController implements Controller {
	constructor(
		private readonly deletePlantInformationUseCase = new DeletePlantInformationUseCase()
	) {}

	public async handleRequest(
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<void> {
		try {
			const { id } = req.params;
			const dto = new DeletePlantInformationDTO({ id });
			const deletePlantInformationOutput = await this.deletePlantInformationUseCase.exec(dto);
			res.status(200).json(deletePlantInformationOutput);
		} catch (err) {
			console.error(err);
			const exception = err as Exception;
			res.status(exception.httpStatus).json(exception.toResponse());
		}
	}

	public async handleMiddleware(
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<void> {}
}
