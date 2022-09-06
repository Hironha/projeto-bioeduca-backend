import { Exception } from "@utils/exception";
import { Controller } from "@utils/controller";

import { CreatePlantInformationDTO } from "@business/dtos/plantInformation/createPlantInformation";
import { CreatePlantInformationUseCase } from "@business/useCases/plantInformation/createPlantInformation";

import { type ParsedQs } from "qs";
import { type ParamsDictionary } from "express-serve-static-core";
import { type Request, type Response, type NextFunction } from "express";

export class CreatePlantInformationController implements Controller {
	constructor(
		private readonly createPlantInformationUseCase = new CreatePlantInformationUseCase()
	) {}

	public async handleRequest(
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<void> {
		try {
			const input = req.body;
			const dto = new CreatePlantInformationDTO(input);
			const createPlantInformationOutput = await this.createPlantInformationUseCase.exec(dto);
			res.status(200).json(createPlantInformationOutput);
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
