import { getAuth } from "firebase-admin/auth";
import { Exception } from "@utils/exception";

import type { Request, Response, NextFunction } from "express";

/**
 * Validates if request is authenticated via firebase based on received bearer token.
 */
export const authenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = (req.headers["authorization"] as string).split(" ").at(1);
		if (!token) throw new Error();

		const auth = getAuth();
		await auth.verifyIdToken(token, true);
		next();
	} catch (err) {
		const exception = new Exception({
			httpStatus: 401,
			code: "UNA-001",
			message: "User is not logged in. Please log in to access resources.",
		});
		res.status(exception.httpStatus).json(exception.toResponse());
	}
};
