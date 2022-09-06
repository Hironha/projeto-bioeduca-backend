import { Router } from "express";
import { handleRequest } from "@utils/controller";

import { ListPlantsController } from "@domain/controllers/plant/listPlants";
import { CreatePlantController } from "@domain/controllers/plant/createPlant";

export const plantBaseURL = "/plants";

export const usePlantsRouter = () => {
	const router = Router({ caseSensitive: true });

	const routes = {
		create: {
			method: "POST",
			path: plantBaseURL,
			controller: new CreatePlantController(),
		},
		list: {
			method: "GET",
			path: plantBaseURL,
			controller: new ListPlantsController(),
		},
	};

	router.post(routes.create.path, handleRequest(routes.create.controller));
	router.get(routes.list.path, handleRequest(routes.list.controller));

	return router;
};
