import { Router } from "express";
import { handleRequest } from "@utils/controller";

import { authenticationMiddleware } from "@domain/middlewares/authentication";

import { CreateUserController } from "@domain/controllers/user/createUser";

export const userBaseURL = "/users";

export const useUserRouter = () => {
	const router = Router({ caseSensitive: true });

	const routes = {
		create: {
			method: "POST",
			path: userBaseURL,
			controller: new CreateUserController(),
		},
	};

	router.post(routes.create.path, authenticationMiddleware, handleRequest(routes.create.controller));

	return router;
};
