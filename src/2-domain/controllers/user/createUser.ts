import { Controller } from "@utils/controller";

import { CreateUserDTO } from "@business/dtos/user/createUser";
import { CreateUserUseCase } from "@business/useCases/user/createUser";

import type { ParsedQs } from "qs";
import type { ParamsDictionary } from "express-serve-static-core";
import type { Request, Response, NextFunction } from "express";

import type { Exception } from "@utils/exception";

export class CreateUserController implements Controller {
	constructor(private createUserUseCase = new CreateUserUseCase()) {}

	public async handleRequest(
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<void> {
		try {
			const input = req.body;
			const dto = new CreateUserDTO(input);
			await this.createUserUseCase.exec(dto);
			res.status(200).end();
		} catch (err) {
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
