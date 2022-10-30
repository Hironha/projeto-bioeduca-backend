import { type Controller } from "@utils/controller";
import { type Exception } from "@utils/exception";

import { UpdatePlantDTO } from "@business/dtos/plant/updatePlant";
import { UpdatePlantUseCase } from "@business/useCases/plant/updatePlant";

import type { ParsedQs } from "qs";
import type { Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";

export class UpdatePlantController implements Controller {
	constructor(private readonly updatePlantUseCase = new UpdatePlantUseCase()) {}

	public async handleRequest(
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>
	): Promise<void> {
		try {
			const input = req.body;
			const { plantId } = req.params;
			const files = req.files;
			const dto = UpdatePlantDTO.fromSerialized({ ...input, images: files, id: plantId });
			const updatePlantOutput = await this.updatePlantUseCase.exec(dto);
			res.status(200).json(updatePlantOutput);
		} catch (err) {
			console.error(err);
			const exception = err as Exception;
			res.status(exception.httpStatus).json(exception.toResponse());
		}
	}
}
