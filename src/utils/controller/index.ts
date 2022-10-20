import type { NextFunction, Request, Response } from "express";

export abstract class Controller {
	public abstract handleRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export const handleRequest = (controller: Controller) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		controller.handleRequest(req, res, next);
	};
};
