import { type Exception } from "@utils/exception";
import { type Controller } from "@utils/controller";

import { DeletePlantDTO } from "@business/dtos/plant/deletePlant";
import { DeletePlantUseCase } from "@business/useCases/plant/deletePlant";

import type { ParsedQs } from "qs";
import type { Request, Response, NextFunction } from "express";
import type { ParamsDictionary } from "express-serve-static-core";

export class DeletePlantController implements Controller {
	constructor(private deletePlantUseCase = new DeletePlantUseCase()) {}

	public async handleRequest(
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<void> {
		try {
			const { plantId } = req.params;
			const dto = new DeletePlantDTO({ id: plantId });
			const plant = await this.deletePlantUseCase.exec(dto);
			res.status(200).json(plant);
		} catch (err) {
			console.error(err);
			const exception = err as Exception;
			res.status(exception.httpStatus).json(exception.toResponse());
		}
	}

	public handleMiddleware(
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): void | Promise<void> {}
}
