import { Router } from "express";
import { handleRequest } from "@utils/controller";

import { ListPlantsController } from "@domain/controllers/plant/listPlants";
import { CreatePlantController } from "@domain/controllers/plant/createPlant";
import { ConsultPlantController } from "@domain/controllers/plant/consultPlant";
import { ListPlantsPreviewController } from "@domain/controllers/plant/listPlantsPreview";
import { DeletePlantController } from "@domain/controllers/plant/deletePlant";

import { createFilesParser } from "@domain/middlewares/parseFiles";

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
		delete: {
			method: "DELETE",
			path: `${plantBaseURL}/:plantId`,
			controller: new DeletePlantController(),
		},
		consult: {
			method: "GET",
			path: `${plantBaseURL}/:plantId`,
			controller: new ConsultPlantController(),
		},
	};

	router.post(
		routes.create.path,
		createFilesParser("images"),
		handleRequest(routes.create.controller)
	);

	router.delete(routes.delete.path, handleRequest(routes.delete.controller));

	router.get(routes.list.path, handleRequest(routes.list.controller));
	router.get(routes.listPreview.path, handleRequest(routes.listPreview.controller));
	router.get(routes.consult.path, handleRequest(routes.consult.controller));

	return router;
};
