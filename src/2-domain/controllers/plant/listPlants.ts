import { Controller } from "@utils/controller";
import { type Exception } from "@utils/exception";

import { ListPlantsDTO } from "@business/dtos/plant/listPlants";
import { ListPlantsUseCase } from "@business/useCases/plant/listPlants";

import type { ParsedQs } from "qs";
import type { ParamsDictionary } from "express-serve-static-core";
import type { Request, Response, NextFunction } from "express";

export class ListPlantsController implements Controller {
	constructor(private readonly listPlantsUseCase = new ListPlantsUseCase()) {}

	public async handleRequest(
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<void> {
		try {
			const input = req.query as any

			const dto = new ListPlantsDTO(input);
			const listPlantsOutput = await this.listPlantsUseCase.exec(dto);
			res.status(200).json(listPlantsOutput);
		} catch (err) {
			console.error(err)
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
