import { Router, type Request, type Response } from "express";

import { authenticate } from "@auth/middleware";
import * as View from "./view";
import { InfoService } from "./service";
import { InfoException } from "./exception";
import { FirebaseInfoRepository } from "./repository";
import { CreateInfoDto, RemoveInfoDto, UpdateInfoDto } from "./dto";

export function createRouter(): Router {
  const router = Router({ caseSensitive: true });
  router.post("/plant-informations", authenticate, create);
  router.get("/plant-informations", findAll);
  router.delete("/plant-informations/:id", authenticate, remove);
  router.put("/plant-informations/:id", authenticate, update);

  return router;
}

export async function create(req: Request, res: Response): Promise<Response> {
  try {
    const body: Record<string, any> = typeof req.body === "object" ? req.body : {};
    const dto = new CreateInfoDto({
      order: body.order,
      description: body.description,
      field_name: body.field_name,
    });
    const service = new InfoService(new FirebaseInfoRepository());
    const entity = await service.create(dto);
    return res.status(201).json(View.fromEntity(entity));
  } catch (e) {
    console.error("Create info route error: ", e);
    const exception = e instanceof InfoException ? e : InfoException.unknown();
    const view = View.fromException(exception);
    return res.status(view.status).json(view.body);
  }
}

export async function findAll(_req: Request, res: Response): Promise<Response> {
  try {
    const service = new InfoService(new FirebaseInfoRepository());
    const entities = await service.findAll();
    return res.status(200).json(entities.map(View.fromEntity));
  } catch (e) {
    console.error("Find all infos route error: ", e);
    const exception = e instanceof InfoException ? e : InfoException.unknown();
    const view = View.fromException(exception);
    return res.status(view.status).json(view.body);
  }
}

export async function remove(req: Request, res: Response): Promise<Response> {
  try {
    const dto = new RemoveInfoDto({ id: req.params.id });
    const service = new InfoService(new FirebaseInfoRepository());
    const entity = await service.remove(dto);
    return res.status(200).json(View.fromEntity(entity));
  } catch (e) {
    console.error("Remove info route error: ", e);
    const exception = e instanceof InfoException ? e : InfoException.unknown();
    const view = View.fromException(exception);
    return res.status(view.status).json(view.body);
  }
}

export async function update(req: Request, res: Response): Promise<Response> {
  try {
    const body: Record<string, any> = typeof req.body === "object" ? req.body : {};
    const dto = new UpdateInfoDto({
      id: req.params.id,
      description: body.description,
      order: body.order,
    });
    const service = new InfoService(new FirebaseInfoRepository());
    const entity = await service.update(dto);
    return res.status(200).json(View.fromEntity(entity));
  } catch (e) {
    console.error("Update info route error: ", e);
    const exception = e instanceof InfoException ? e : InfoException.unknown();
    const view = View.fromException(exception);
    return res.status(view.status).json(view.body);
  }
}
