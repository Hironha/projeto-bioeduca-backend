import { v7 as uuidv7 } from "uuid";

import { Metadata } from "@core/metadata";

export class PlantEntity {
  public readonly id: string;
  public name: PlantName;
  public readonly metadata: Metadata;
  private _infos: Record<string, string>;
  private _images: string[];

  constructor(
    id: string,
    name: PlantName,
    infos: Record<string, string> | undefined,
    images: string[] | undefined,
    metadata: Metadata
  ) {
    this.id = id;
    this.name = name;
    this._infos = infos ?? {};
    this._images = images ?? [];
    this.metadata = metadata;
  }

  static new(name: PlantName, infos?: Record<string, string>, images?: string[]): PlantEntity {
    const id = uuidv7();
    return new PlantEntity(id, name, infos, images, Metadata.new());
  }

  infos(): Readonly<Record<string, string>> {
    return this._infos;
  }

  images(): Readonly<string[]> {
    return this._images;
  }

  setInfos(infos: Record<string, string>) {
    this._infos = infos;
  }

  setImages(images: string[]): void {
    this._images = images;
  }
}

export class PlantName {
  constructor(public readonly popular: string, public readonly scientific: string) {}
}
