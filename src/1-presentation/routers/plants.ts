import { Router } from "express";
import { configureRouter, type Route } from "@utils/route";

import { authenticationMiddleware } from "@domain/middlewares/authentication";

import { ListPlantsController } from "@domain/controllers/plant/listPlants";
import { CreatePlantController } from "@domain/controllers/plant/createPlant";
import { ConsultPlantController } from "@domain/controllers/plant/consultPlant";
import { ListPlantsPreviewController } from "@domain/controllers/plant/listPlantsPreview";
import { DeletePlantController } from "@domain/controllers/plant/deletePlant";
import { UpdatePlantController } from "@domain/controllers/plant/updatePlant";

import { createFilesParser } from "@domain/middlewares/parseFiles";

export const plantBaseURL = "/plants";

export const usePlantsRouter = () => {
	const router = Router({ caseSensitive: true });

	const routes: Record<string, Route> = {
		create: {
			method: "POST",
			path: plantBaseURL,
			middlewares: [createFilesParser("images"), authenticationMiddleware],
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
		delete: {
			method: "DELETE",
			path: `${plantBaseURL}/:plantId`,
			middlewares: [authenticationMiddleware],
			controller: new DeletePlantController(),
		},
		update: {
			method: "PUT",
			path: `${plantBaseURL}/:plantId`,
			middlewares: [createFilesParser("images"), authenticationMiddleware],
			controller: new UpdatePlantController(),
		},
		consult: {
			method: "GET",
			path: `${plantBaseURL}/:plantId`,
			controller: new ConsultPlantController(),
		},
	};

	configureRouter(router, routes);

	return router;
};
