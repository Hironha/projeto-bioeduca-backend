import { unreachable } from "@core/unreachable";
import { type InfoEntity } from "./entity";
import { type InfoException } from "./exception";

export type InfoJsonView = {
  id: string;
  order: number;
  field_name: string;
  description: string;
  created_at: number;
  updated_at: number;
};

export function fromEntity(entity: InfoEntity): InfoJsonView {
  return {
    id: entity.id,
    order: entity.order,
    field_name: entity.name,
    description: entity.description,
    created_at: entity.metadata.createdAt().getTime(),
    updated_at: entity.metadata.updatedAt().getTime(),
  };
}

export type InfoExceptionJsonBody = { code: string; message: string };
export type InfoExceptionJsonView = { status: number; body: InfoExceptionJsonBody };
export function fromException(exception: InfoException): InfoExceptionJsonView {
  const body: InfoExceptionJsonBody = { code: exception.code, message: exception.message };
  switch (exception.code) {
    case "PI-001":
      return { status: 500, body };
    case "PI-002":
      return { status: 400, body };
    case "PI-003":
      return { status: 409, body };
    case "PI-004":
      return { status: 404, body };
    case "PI-010":
      return { status: 500, body };
    default:
      unreachable(exception.code, "Unreachable case of info exception");
      return { status: 500, body };
  }
}
