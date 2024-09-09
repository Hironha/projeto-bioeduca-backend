import { Metadata } from "@core/metadata";
import { InfoEntity } from "./entity";

export type InfoModel = {
  id: string;
  order: number;
  field_name: string;
  description: string;
  updated_at: number;
  created_at: number;
};

export function fromEntity(entity: InfoEntity): InfoModel {
  return {
    id: entity.id,
    order: entity.order,
    field_name: entity.name,
    description: entity.description,
    created_at: entity.metadata.createdAt().getTime(),
    updated_at: entity.metadata.updatedAt().getTime(),
  };
}

export function toEntity(model: InfoModel): InfoEntity {
  const metadata = new Metadata(new Date(model.created_at), new Date(model.updated_at));
  return new InfoEntity(model.id, model.order, model.field_name, model.description, metadata);
}
