import type { Router } from "express";

export const getAvailableRoutes = (router: Router, baseUrl: string) => {
	const routes = router.stack.map((stack) => stack.route);
	const availableRoutes = routes.filter((route) => route.methods);
	const formattedRoutes = availableRoutes.map((route) => ({
		path: baseUrl.concat(route.path),
		method: Object.keys(route.methods).at(0),
	}));

	return formattedRoutes;
};
