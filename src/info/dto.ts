import { IsNotEmpty, IsNumber, IsString, IsOptional } from "class-validator";

import { Validator, type Validatable } from "@core/validate";
import { InfoException } from "./exception";

export type CreateInfoRequest = {
  field_name: string;
  description: string;
  order: number;
};

export class CreateInfoDto extends Validator implements Validatable<CreateInfoRequest> {
  @IsString()
  @IsNotEmpty()
  private field_name: string;

  @IsString()
  @IsNotEmpty()
  private description: string;

  @IsNumber()
  @IsNotEmpty()
  private order: number;

  constructor(req: CreateInfoRequest) {
    super();
    this.order = req.order;
    this.field_name = req.field_name;
    this.description = req.description;
  }

  /**
   * @throws {InfoException}
   */
  async validated(): Promise<CreateInfoRequest> {
    await this.validate().catch((cause) => {
      console.error("Invalid create plant information dto: ", cause);
      throw createValidationError(cause);
    });

    return {
      field_name: this.field_name,
      description: this.description,
      order: this.order,
    };
  }
}

export type RemoveInfoRequest = { id: string };

export class RemoveInfoDto extends Validator implements Validatable<RemoveInfoRequest> {
  @IsNotEmpty()
  @IsString()
  private id: string;

  constructor(req: RemoveInfoRequest) {
    super();
    this.id = req.id;
  }

  /**
   * @throws {InfoException}
   */
  async validated(): Promise<RemoveInfoRequest> {
    await this.validate().catch((cause) => {
      console.error("Invalid remove plant information dto: ", cause);
      throw createValidationError(cause);
    });

    return { id: this.id };
  }
}

export type UpdateInfoRequest = {
  id: string;
  description?: string;
  order?: number;
};

export class UpdateInfoDto extends Validator implements Validatable<UpdateInfoRequest> {
  @IsNotEmpty()
  @IsString()
  private id: string;

  @IsString()
  @IsNotEmpty()
  private description?: string;

  @IsNumber()
  @IsOptional()
  private order?: number;

  constructor(req: UpdateInfoRequest) {
    super();
    this.id = req.id;
    this.description = req.description;
    this.order = req.order;
  }

  /**
   * @throws {InfoException}
   */
  async validated(): Promise<UpdateInfoRequest> {
    await this.validate().catch((cause) => {
      console.error("Invalid update plant information dto: ", cause);
      throw createValidationError(cause);
    });

    return {
      id: this.id,
      description: this.description,
      order: this.order,
    };
  }
}

function createValidationError(cause: unknown): InfoException {
  const message = cause instanceof Error ? cause.message : undefined;
  return InfoException.validation(message);
}
