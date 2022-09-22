import { Router } from "express";
import { handleRequest, handleMiddleware } from "@utils/controller";

import { ListPlantsController } from "@domain/controllers/plant/listPlants";
import { CreatePlantController } from "@domain/controllers/plant/createPlant";
import { ConsultPlantController } from "@domain/controllers/plant/consultPlant";
import { ListPlantsPreviewController } from "@domain/controllers/plant/listPlantsPreview";

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
		listPreview: {
			method: "GET",
			path: `${plantBaseURL}/preview`,
			controller: new ListPlantsPreviewController(),
		},
		consult: {
			method: "GET",
			path: `${plantBaseURL}/:plantId`,
			controller: new ConsultPlantController(),
		},
	};

	router.post(
		routes.create.path,
		handleMiddleware(routes.create.controller),
		handleRequest(routes.create.controller)
	);

	router.get(routes.list.path, handleRequest(routes.list.controller));
	router.get(routes.listPreview.path, handleRequest(routes.listPreview.controller));
	router.get(routes.consult.path, handleRequest(routes.consult.controller));

	return router;
};
