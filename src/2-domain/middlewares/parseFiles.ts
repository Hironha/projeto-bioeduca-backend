import multer from "multer";

import type { ParsedQs } from "qs";
import type { Request, Response, NextFunction } from "express";
import type { ParamsDictionary } from "express-serve-static-core";

export const createFilesParser = (fieldName: string) => {
	const multerMiddleware = multer();
	return (
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	) => {
		const filesParser = multerMiddleware.array(fieldName);
		filesParser(req, res, next);
	};
};
