import { IsNotEmpty, IsString, IsOptional, IsObject, IsInt, Min, Max } from "class-validator";

import { Validator, type Validatable } from "@core/validate";
import { ImageArray } from "@utils/validations/imageArray";
import { PlantException } from "./exception";

export type CreatePlantRequest = {
  popular_name: string;
  scientific_name: string;
  additional_informations?: Record<string, string>;
  images?: Express.Multer.File[];
};

export class CreatePlantDto extends Validator implements Validatable<CreatePlantRequest> {
  @IsNotEmpty()
  @IsString()
  private popular_name: string;

  @IsNotEmpty()
  @IsString()
  private scientific_name: string;

  @IsOptional()
  @IsObject()
  private additional_informations?: Record<string, string>;

  @ImageArray({ maxCount: 5, mime: ["image/jpeg", "image/jpg", "image/png"] })
  private images?: Express.Multer.File[];

  constructor(req: CreatePlantRequest) {
    super();
    this.popular_name = req.popular_name;
    this.scientific_name = req.scientific_name;
    this.additional_informations = req.additional_informations;
    this.images = req.images;
  }

  /**
   * @throws {PlantException}
   */
  async validated(): Promise<CreatePlantRequest> {
    await this.validate().catch((e) => {
      console.debug("Invalid create plant dto: ", e);
      throw createValidationError(e);
    });

    return {
      popular_name: this.popular_name,
      scientific_name: this.scientific_name,
      additional_informations: this.additional_informations,
      images: this.images,
    };
  }
}

export type FindPlantRequest = { id: string };

export class FindPlantDto extends Validator implements Validatable<FindPlantRequest> {
  @IsNotEmpty()
  @IsString()
  private id: string;

  constructor(req: FindPlantRequest) {
    super();
    this.id = req.id;
  }

  async validated(): Promise<FindPlantRequest> {
    await this.validate().catch((cause) => {
      console.debug("Invalid find plant dto: ", cause);
      throw createValidationError(cause);
    });

    return { id: this.id };
  }
}

export type ListPlantsRequest = {
  perPage: number;
  lastKey?: string;
};

export class ListPlantsDto extends Validator implements Validatable<ListPlantsRequest> {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(20)
  private perPage: number;

  @IsOptional()
  @IsString()
  private lastKey?: string;

  constructor(req: ListPlantsRequest) {
    super();
    this.perPage = req.perPage;
    this.lastKey = req.lastKey;
  }

  async validated(): Promise<ListPlantsRequest> {
    await this.validate().catch((e) => {
      console.debug("Invalid list plants dto: ", e);
      throw createValidationError(e);
    });

    return {
      perPage: this.perPage,
      lastKey: this.lastKey,
    };
  }
}

export type RemovePlantRequest = { id: string };

export class RemovePlantDto extends Validator implements Validatable<RemovePlantRequest> {
  @IsNotEmpty()
  @IsString()
  private id: string;

  constructor(req: RemovePlantRequest) {
    super();
    this.id = req.id;
  }

  async validated(): Promise<RemovePlantRequest> {
    await this.validate().catch((cause) => {
      console.debug("Invalid remove plant dto: ", cause);
      throw createValidationError(cause);
    });

    return { id: this.id };
  }
}

export type UpdatePlantRequest = {
  id: string;
  popular_name: string;
  scientific_name: string;
  additional_informations?: Record<string, string>;
  delete_images?: string[];
  images?: Express.Multer.File[];
};

export class UpdatePlantDto extends Validator implements Validatable<UpdatePlantRequest> {
  @IsNotEmpty()
  @IsString()
  private id: string;

  @IsOptional()
  @IsString()
  private popular_name: string;

  @IsOptional()
  @IsString()
  private scientific_name: string;

  @IsOptional()
  @IsObject()
  private additional_informations?: Record<string, string>;

  @IsOptional()
  @IsString({ each: true })
  private delete_images?: string[];

  @IsOptional()
  @ImageArray({ maxCount: 5, mime: ["image/jpeg", "image/jpg", "image/png"] })
  private images?: Express.Multer.File[];

  constructor(req: UpdatePlantRequest) {
    super();
    this.id = req.id;
    this.popular_name = req.popular_name;
    this.scientific_name = req.scientific_name;
    this.additional_informations = req.additional_informations;
    this.delete_images = req.delete_images;
    this.images = req.images;
  }

  async validated(): Promise<UpdatePlantRequest> {
    await this.validate().catch((cause) => {
      console.debug("Invalid update plant dto: ", cause);
      throw createValidationError(cause);
    });

    return {
      id: this.id,
      popular_name: this.popular_name,
      scientific_name: this.scientific_name,
      additional_informations: this.additional_informations,
      delete_images: this.delete_images,
      images: this.images,
    };
  }
}

function createValidationError(cause: unknown): PlantException {
  const message = cause instanceof Error ? cause.message : undefined;
  return PlantException.validation(message);
}
