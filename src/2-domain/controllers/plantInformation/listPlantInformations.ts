import { Exception } from "@utils/exception";
import { Controller } from "@utils/controller";

import { ListPlantInfomationsDTO } from "@business/dtos/plantInformation/listPlantInformations";

import { type ParsedQs } from "qs";
import { type ParamsDictionary } from "express-serve-static-core";
import { type Request, type Response, type NextFunction } from "express";
import { ListPlantInformationsUseCase } from "@business/useCases/plantInformation/listPlantInformations";

export class ListPlantInformationsController implements Controller {
	constructor(private readonly listPlantInformationsUseCase = new ListPlantInformationsUseCase()) {}

	public async handleRequest(
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<void> {
		try {
			const input = req.body;
			const dto = new ListPlantInfomationsDTO(input);
			const listPlantInformationsOutput = await this.listPlantInformationsUseCase.exec(dto);
			res.status(200).json(listPlantInformationsOutput);
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
