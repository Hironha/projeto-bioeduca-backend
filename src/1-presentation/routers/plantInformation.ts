import { Router } from "express";
import { configureRouter, type Route } from "@utils/route";

import { authenticationMiddleware } from "@domain/middlewares/authentication";

import { CreatePlantInformationController } from "@domain/controllers/plantInformation/createPlantInformation";
import { ListPlantInformationsController } from "@domain/controllers/plantInformation/listPlantInformations";
import { EditPlantInformationController } from "@domain/controllers/plantInformation/editPlantInformation";
import { DeletePlantInformationController } from "@domain/controllers/plantInformation/deletePlantInformation";

export const plantInformationBaseURL = "/plant-informations";

export const usePlantInformationRouter = () => {
	const router = Router({ caseSensitive: true });

	const routes: Record<string, Route> = {
		create: {
			method: "POST",
			path: plantInformationBaseURL,
			middlewares: [authenticationMiddleware],
			controller: new CreatePlantInformationController(),
		},
		list: {
			method: "GET",
			path: plantInformationBaseURL,
			controller: new ListPlantInformationsController(),
		},
		edit: {
			method: "PUT",
			path: `${plantInformationBaseURL}/:id`,
			middlewares: [authenticationMiddleware],
			controller: new EditPlantInformationController(),
		},
		delete: {
			method: "DELETE",
			path: `${plantInformationBaseURL}/:id`,
			middlewares: [authenticationMiddleware],
			controller: new DeletePlantInformationController(),
		},
	};

	configureRouter(router, routes);

	return router;
};
