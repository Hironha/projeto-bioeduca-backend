import * as dotenv from "dotenv";
import express, { Router } from "express";
import helmet from "helmet";
import cors from "cors";

import * as InfoRoutes from "./info/routes";
import * as PlantRoutes from "./plant/routes";
import * as UserRoutes from "./user/routes";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet({ referrerPolicy: { policy: "no-referrer" } }));
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT ? parseInt(process.env.PORT) : 4000;
const hostname: string = process.env.HOSTNAME ?? "localhost";
const host = `${hostname}:${port}`;
const baseUrl = process.env.BASE_URL_SUFFIX ? `${host}${process.env.BASE_URL_SUFFIX}` : host;

const routers = [InfoRoutes.createRouter(), PlantRoutes.createRouter(), UserRoutes.createRouter()];

routers.forEach((router) => {
  app.use(router);
  logRoutes(router);
});

app.listen(port, hostname, () => {
  console.log(`Server started on port ${port}`);
});

function logRoutes(router: Router): void {
  const routes = router.stack.map((stack) => stack.route);
  for (const route of routes) {
    if (!route.methods) {
      continue;
    }

    const endpoint = baseUrl.concat(route.path);
    const method = Object.keys(route.methods).at(0)?.toUpperCase();
    console.debug({ endpoint, method });
  }
}
