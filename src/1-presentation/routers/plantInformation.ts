import { Router } from "express";
import { handleRequest } from "@utils/controller";

import { CreatePlantInformationController } from "@domain/controllers/plantInformation/createPlantInformation";
import { ListPlantInformationsController } from "@domain/controllers/plantInformation/listPlantInformations";

export const plantInformationBaseURL = "/plant-informations";

export const usePlantInformationRouter = () => {
	const router = Router({ caseSensitive: true });

	const routes = {
		create: {
			method: "POST",
			path: plantInformationBaseURL,
			controller: new CreatePlantInformationController(),
		},
		list: {
			method: "GET",
			path: plantInformationBaseURL,
			controller: new ListPlantInformationsController(),
		},
	};

	router.post(routes.create.path, handleRequest(routes.create.controller));
	router.get(routes.list.path, handleRequest(routes.list.controller));

	return router;
};
