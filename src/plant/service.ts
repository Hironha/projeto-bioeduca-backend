import { type InfoEntity } from "@info/entity";
import { type FirebaseInfoRepository } from "@info/repository";
import { PlantEntity, PlantName } from "./entity";
import { PlantException } from "./exception";
import { type FirebasePlantRepository, type PlantsList } from "./repository";
import { type FirebasePlantImageStorage, type Image } from "./storage";
import {
  type FindPlantDto,
  type CreatePlantDto,
  type ListPlantsDto,
  type RemovePlantDto,
  type UpdatePlantDto,
} from "./dto";

export class PlantService {
  constructor(
    private readonly plants: FirebasePlantRepository,
    private readonly infos: FirebaseInfoRepository,
    private readonly storage: FirebasePlantImageStorage
  ) {}

  /**
   * @throws {PlantException}
   */
  async create(dto: CreatePlantDto): Promise<PlantEntity> {
    const req = await dto.validated();
    const infos = await this.infos.findAll().catch((e) => {
      console.error("Failed finding all infos at plant service: ", e);
      throw PlantException.db();
    });

    this.validateInfos(infos, req.additional_informations ?? {});

    const images = req.images?.map(this.toStorageImage);
    if (images) {
      // TODO: would probably need a logic to delete all images if some store fails
      await Promise.all(images.map((img) => this.storage.store(plant.id, img)));
    }

    const plant = PlantEntity.new(
      new PlantName(req.popular_name, req.scientific_name),
      req.additional_informations,
      images?.map((img) => img.filename)
    );
    await this.plants.create(plant);
    return plant;
  }

  /**
   * @throws {PlantException}
   */
  async find(dto: FindPlantDto): Promise<PlantEntity> {
    const req = await dto.validated();
    const entity = await this.plants.find(req.id);
    if (!entity) {
      throw PlantException.notFound(`Plant with id ${req.id} could not be found.`);
    }

    return entity;
  }

  /**
   * @throws {PlantException}
   */
  async list(dto: ListPlantsDto): Promise<PlantsList> {
    const req = await dto.validated();
    return await this.plants.list({
      perPage: req.perPage,
      lastKey: req.lastKey,
    });
  }

  /**
   * @throws {PlantException}
   */
  async remove(dto: RemovePlantDto): Promise<PlantEntity> {
    const req = await dto.validated();
    return await this.plants.remove(req.id);
  }

  /**
   * @throws {PlantException}
   */
  async update(dto: UpdatePlantDto): Promise<PlantEntity> {
    const req = await dto.validated();
    const entity = await this.plants.find(req.id);
    if (!entity) {
      throw PlantException.notFound(`Plant with id ${req.id} could not be found.`);
    }

    const infos = await this.infos.findAll().catch((e) => {
      console.error("Failed finding all infos at plant service: ", e);
      throw PlantException.db();
    });

    if (req.additional_informations && Object.keys(req.additional_informations).length > 0) {
      this.validateInfos(infos, req.additional_informations);
    }

    if (req.delete_images && req.delete_images.length > 0) {
      const promises = req.delete_images.map((filename) => {
        return this.storage.remove(entity.id, filename);
      });
      await Promise.all(promises);
    }

    const images = req.images?.map(this.toStorageImage);
    if (images && images.length > 0) {
      // TODO: probably need error handling here, maybe a rollback logic something like that
      await Promise.all(images.map((img) => this.storage.store(entity.id, img)));
    }

    entity.name = new PlantName(req.popular_name, req.scientific_name);
    entity.setInfos(req.additional_informations ?? {});
    entity.setImages(images?.map((img) => img.filename) ?? []);
    entity.metadata.update();
    await this.plants.update(entity);

    return entity;
  }

  private toStorageImage(file: Express.Multer.File): Image {
    return {
      buffer: file.buffer,
      filename: file.filename || file.originalname,
      mimetype: file.mimetype,
    };
  }

  /**
   * @throws {PlantException}
   */
  private validateInfos(entities: InfoEntity[], infos: Record<string, string>) {
    for (const key in infos) {
      if (!entities.some((entity) => entity.name === key)) {
        console.error(`Invalid plant information ${key} at plant service`);
        throw PlantException.validation(`Plant information ${key} does not exists`);
      }
    }
  }
}
