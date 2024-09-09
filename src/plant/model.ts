import { Metadata } from "@core/metadata";
import { PlantEntity, PlantName } from "./entity";

export type PlantModel = {
  id: string;
  popular_name: string;
  scientific_name: string;
  images: string[];
  additional_informations: Record<string, string>;
  created_at: number;
  updated_at: number;
};

export function fromEntity(entity: PlantEntity): PlantModel {
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

export function toEntity(model: PlantModel): PlantEntity {
  const name = new PlantName(model.popular_name, model.scientific_name);
  const metadata = new Metadata(new Date(model.created_at), new Date(model.updated_at));
  return new PlantEntity(model.id, name, model.additional_informations, model.images, metadata);
}
