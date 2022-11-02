import { type Router, type Request, type Response, type NextFunction } from "express";
import { handleRequest, type Controller } from "@utils/controller";

type Middleware = (req: Request, res: Response, next: NextFunction) => void | Promise<void>;

export type Route = {
	method: "GET" | "POST" | "PUT" | "DELETE";
	path: string;
	middlewares?: Middleware[];
	controller: Controller;
};

const configGetRoute = (router: Router, config: Omit<Route, "method">) => {
	router.get(config.path, ...(config.middlewares ?? []), handleRequest(config.controller));
};

const configPostRoute = (router: Router, config: Omit<Route, "method">) => {
	router.post(config.path, ...(config.middlewares ?? []), handleRequest(config.controller));
};

const configPutRoute = (router: Router, config: Omit<Route, "method">) => {
	router.put(config.path, ...(config.middlewares ?? []), handleRequest(config.controller));
};

const configDeleteRoute = (router: Router, config: Omit<Route, "method">) => {
	router.delete(config.path, ...(config.middlewares ?? []), handleRequest(config.controller));
};

const getRouteConfigurator = (method: Route["method"]) => {
	switch (method) {
		case "GET":
			return configGetRoute;
		case "POST":
			return configPostRoute;
		case "PUT":
			return configPutRoute;
		case "DELETE":
			return configDeleteRoute;
		default:
			return null as never;
	}
};

export const configureRouter = (router: Router, config: Record<string, Route>) => {
	const routes = Object.values(config);
	routes.forEach((route) => {
		const routeConfigurator = getRouteConfigurator(route.method);
		routeConfigurator(router, route);
	});
};
