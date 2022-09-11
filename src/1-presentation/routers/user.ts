import { Router } from "express";
import { handleRequest } from "@utils/controller";

import { CreateUserController } from "@domain/controllers/user/createUser";

export const userBaseURL = "/user";

export const useUserRouter = () => {
	const router = Router({ caseSensitive: true });

	const routes = {
		create: {
			method: "POST",
			path: userBaseURL,
			controller: new CreateUserController(),
		},
	};

	router.post(routes.create.path, handleRequest(routes.create.controller));

	return router;
};
