import { Controller } from "@utils/controller";
import type { Exception } from "@utils/exception";

import { CreatePlantDTO } from "@business/dtos/plant/createPlant";
import { CreatePlantUseCase } from "@business/useCases/plant/createPlant";

import type { ParsedQs } from "qs";
import type { Request, Response, NextFunction } from "express";
import type { ParamsDictionary } from "express-serve-static-core";

export class CreatePlantController implements Controller {
	constructor(private readonly createPlantUseCase = new CreatePlantUseCase()) {}

	public async handleRequest(
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<void> {
		try {
			const input = req.body;
			const dto = new CreatePlantDTO(input);
			const createPlantOutput = await this.createPlantUseCase.exec(dto);
			res.status(200).json(createPlantOutput);
		} catch (err) {
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