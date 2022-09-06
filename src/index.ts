import * as dotenv from "dotenv";
import express, { type Router } from "express";
import helmet from "helmet";
import cors from "cors";

import { getAvailableRoutes } from "@utils/routes";
import { usePlantsRouter } from "@presentation/routers/plants";
import { usePlantInformationRouter } from "@presentation/routers/plantInformation";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet({ referrerPolicy: { policy: "no-referrer" } }));
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT ? parseInt(process.env.PORT) : 4000;
const hostname: string = process.env.NODE_ENV === "development" ? "localhost" : "localhost";

const baseUrl = `${hostname}:${port}`;

const routers: Router[] = [usePlantsRouter(), usePlantInformationRouter()];

routers.forEach((router) => {
	app.use(router);
	console.log(getAvailableRoutes(router, baseUrl));
});

app.listen(port, hostname, () => {
	console.log(`Server started on port ${port}`);
});
