import { Controller } from "@utils/controller";
import { type Exception } from "@utils/exception";

import { ListPlantsPreviewDTO } from "@business/dtos/plant/listPlantsPreview";
import { ListPlantsPreviewUseCase } from "@business/useCases/plant/listPlantsPreview";

import type { ParsedQs } from "qs";
import type { ParamsDictionary } from "express-serve-static-core";
import type { Request, Response, NextFunction } from "express";

export class ListPlantsPreviewController implements Controller {
	constructor(private readonly listPlantsPreviewUseCase = new ListPlantsPreviewUseCase()) {}

	public async handleRequest(
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<void> {
		try {
			const input = req.query as any;

			const dto = new ListPlantsPreviewDTO(input);
			const listPlantsPreviewOutput = await this.listPlantsPreviewUseCase.exec(dto);
			res.status(200).json(listPlantsPreviewOutput);
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
