import { Router, type Request, type Response } from "express";

import { createFilesParser } from "@core/multipart";
import { authenticate } from "@auth/middleware";
import { FirebaseInfoRepository } from "@info/repository";
import * as View from "./view";
import { PlantService } from "./service";
import { FirebasePlantRepository } from "./repository";
import { FirebasePlantImageStorage } from "./storage";
import { PlantException } from "./exception";
import { CreatePlantDto, FindPlantDto, ListPlantsDto, RemovePlantDto, UpdatePlantDto } from "./dto";

export function createRouter(): Router {
  const router = Router({ caseSensitive: true });
  router.post("/plants", authenticate, createFilesParser("images"), create);
  router.get("/plants", list);
  router.get("/plants/:id", find);
  router.delete("/plants/:id", authenticate, remove);
  router.put("/plants/:id", authenticate, createFilesParser("images"), update);

  return router;
}

export async function create(req: Request, res: Response): Promise<Response> {
  try {
    const body: Record<string, any> = typeof req.body === "object" ? req.body : {};
    const dto = new CreatePlantDto({
      popular_name: body.popular_name,
      scientific_name: body.scientific_name,
      additional_informations: body.additional_informations,
      images: body.images,
    });
    const service = new PlantService(
      new FirebasePlantRepository(),
      new FirebaseInfoRepository(),
      new FirebasePlantImageStorage()
    );
    const entity = await service.create(dto);
    return res.status(201).json(View.fromEntity(entity));
  } catch (e) {
    const exception = e instanceof PlantException ? e : PlantException.unknown();
    const view = View.fromException(exception);
    return res.status(view.status).json(view.body);
  }
}

export async function find(req: Request, res: Response): Promise<Response> {
  try {
    const dto = new FindPlantDto({ id: req.params.id });
    const service = new PlantService(
      new FirebasePlantRepository(),
      new FirebaseInfoRepository(),
      new FirebasePlantImageStorage()
    );
    const entity = await service.find(dto);
    return res.status(200).json(View.fromEntity(entity));
  } catch (e) {
    const exception = e instanceof PlantException ? e : PlantException.unknown();
    const view = View.fromException(exception);
    return res.status(view.status).json(view.body);
  }
}

export async function list(req: Request, res: Response): Promise<Response> {
  try {
    const dto = new ListPlantsDto({
      perPage: Number(req.query.perPage),
      lastKey: req.query.lastKey ? String(req.query.lastKey) : undefined,
    });
    const service = new PlantService(
      new FirebasePlantRepository(),
      new FirebaseInfoRepository(),
      new FirebasePlantImageStorage()
    );
    const list = await service.list(dto);
    return res.status(200).json(View.fromList(list));
  } catch (e) {
    const exception = e instanceof PlantException ? e : PlantException.unknown();
    const view = View.fromException(exception);
    return res.status(view.status).json(view.body);
  }
}

export async function remove(req: Request, res: Response): Promise<Response> {
  try {
    const dto = new RemovePlantDto({ id: req.params.id });
    const service = new PlantService(
      new FirebasePlantRepository(),
      new FirebaseInfoRepository(),
      new FirebasePlantImageStorage()
    );
    const entity = await service.remove(dto);
    return res.status(200).json(View.fromEntity(entity));
  } catch (e) {
    const exception = e instanceof PlantException ? e : PlantException.unknown();
    const view = View.fromException(exception);
    return res.status(view.status).json(view.body);
  }
}

export async function update(req: Request, res: Response): Promise<Response> {
  try {
    const body: Record<string, any> = typeof req.body === "object" ? req.body : {};
    const dto = new UpdatePlantDto({
      id: req.params.id,
      popular_name: body.popular_name,
      scientific_name: body.scientific_name,
      additional_informations: body.additional_informations,
      delete_images: body.delete_images,
      images: body.images,
    });
    const service = new PlantService(
      new FirebasePlantRepository(),
      new FirebaseInfoRepository(),
      new FirebasePlantImageStorage()
    );
    const entity = await service.update(dto);
    return res.status(200).json(View.fromEntity(entity));
  } catch (e) {
    const exception = e instanceof PlantException ? e : PlantException.unknown();
    const view = View.fromException(exception);
    return res.status(view.status).json(view.body);
  }
}
