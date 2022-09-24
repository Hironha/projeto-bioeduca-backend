import { Exception } from "@utils/exception";
import { Controller } from "@utils/controller";

import { EditPlantInformationDTO } from "@business/dtos/plantInformation/editPlantInformation";
import { EditPlantInformationUseCase } from "@business/useCases/plantInformation/editPlantInformation";

import { type ParsedQs } from "qs";
import { type ParamsDictionary } from "express-serve-static-core";
import { type Request, type Response, type NextFunction } from "express";

export class EditPlantInformationController implements Controller {
	constructor(private readonly editPlantInformationUseCase = new EditPlantInformationUseCase()) {}

	public async handleRequest(
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
	): Promise<void> {
		try {
			const input = req.body;
			const { id } = req.query;
			const dto = new EditPlantInformationDTO({ ...input, id });
			const editPlantInformationOutput = await this.editPlantInformationUseCase.exec(dto);
			res.status(200).json(editPlantInformationOutput);
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
