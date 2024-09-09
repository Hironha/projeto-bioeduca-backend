import { Router, type Request, type Response } from "express";

import * as View from "./view";
import { UserService } from "./service";
import { UserException } from "./exception";
import { FirebaseUserRepository } from "./repository";
import { CreateUserDto } from "./dto";

export function createRouter(): Router {
  const router = Router({ caseSensitive: true });
  router.post("/users", create);

  return router;
}

export async function create(req: Request, res: Response): Promise<Response> {
  try {
    const body: Record<string, any> = typeof req.body === "object" ? req.body : {};
    const dto = new CreateUserDto({ email: body.email });
    const service = new UserService(new FirebaseUserRepository());
    await service.create(dto);
    return res.status(201);
  } catch (e) {
    const exception = e instanceof UserException ? e : UserException.unknown();
    const view = View.fromException(exception);
    return res.status(view.status).json(view.body);
  }
}
