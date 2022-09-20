import { type Exception } from "@utils/exception";
import { type Controller } from "@utils/controller";

import type { ParsedQs } from "qs";
import type { Request, Response, NextFunction } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import { ConsultPlantDTO } from "@business/dtos/plant/consultPlant";
import { ConsultPlantUseCase } from "@business/useCases/plant/consultPlant";

export class ConsultPlantController implements Controller {
	constructor(private consultPlantUseCase = new ConsultPlantUseCase()) {}

	public async handleRequest(
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<void> {
		try {
			const input = req.params;
			const dto = new ConsultPlantDTO(input);
			const plant = await this.consultPlantUseCase.exec(dto);
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
