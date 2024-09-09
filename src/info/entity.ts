import { v7 as uuidv7 } from "uuid";

import { Metadata } from "@core/metadata";

export class InfoEntity {
  public readonly id: string;
  public order: number;
  public readonly name: string;
  public description: string;
  public readonly metadata: Metadata;

  constructor(id: string, order: number, name: string, description: string, metadata: Metadata) {
    this.id = id;
    this.order = order;
    this.name = name;
    this.description = description;
    this.metadata = metadata;
  }

  static new(order: number, name: string, description: string): InfoEntity {
    const id = uuidv7();
    return new InfoEntity(id, order, name, description, Metadata.new());
  }
}
