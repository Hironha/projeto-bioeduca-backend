import { Router } from "express";
import { configureRouter, type Route } from "@utils/route";

import { authenticationMiddleware } from "@domain/middlewares/authentication";

import { CreateUserController } from "@domain/controllers/user/createUser";

export const userBaseURL = "/users";

export const useUserRouter = () => {
	const router = Router({ caseSensitive: true });

	const routes: Record<string, Route> = {
		create: {
			method: "POST",
			path: userBaseURL,
			middlewares: [authenticationMiddleware],
			controller: new CreateUserController(),
		},
	};

	configureRouter(router, routes);

	return router;
};
