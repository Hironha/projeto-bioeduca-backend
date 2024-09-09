import { unreachable } from "@core/unreachable";
import { type PlantEntity } from "./entity";
import { type PlantException } from "./exception";
import { type PlantsList } from "./repository";

export type PlantJsonView = {
  id: string;
  popular_name: string;
  scientific_name: string;
  images: string[];
  additional_informations: Record<string, string>;
  created_at: number;
  updated_at: number;
};

export function fromEntity(entity: PlantEntity): PlantJsonView {
  return {
    id: entity.id,
    popular_name: entity.name.popular,
    scientific_name: entity.name.scientific,
    images: Array.from(entity.images()),
    additional_informations: entity.infos(),
    created_at: entity.metadata.createdAt().getTime(),
    updated_at: entity.metadata.updatedAt().getTime(),
  };
}

export type PlantsListJsonView = {
  hasMore: boolean;
  items: PlantJsonView[];
  lastKey?: string;
};

export function fromList(list: PlantsList): PlantsListJsonView {
  return {
    hasMore: list.hasMore,
    items: list.items.map(fromEntity),
    lastKey: list.lastKey,
  };
}

export type PlantExceptionJsonBody = {
  code: string;
  message: string;
};

export type PlantExceptionJsonView = {
  status: number;
  body: PlantExceptionJsonBody;
};

export function fromException(exception: PlantException): PlantExceptionJsonView {
  const body: PlantExceptionJsonBody = { code: exception.code, message: exception.message };
  switch (exception.code) {
    case "PL-002":
      return { status: 400, body };
    case "PL-003":
      return { status: 404, body };
    case "PL-010":
    case "PL-011":
    case "PL-012":
      return { status: 500, body };
    default:
      unreachable(exception.code);
      return { status: 500, body };
  }
}
