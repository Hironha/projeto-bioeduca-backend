import { InfoEntity } from "./entity";
import { InfoException } from "./exception";
import { FirebaseInfoRepository } from "./repository";
import { type CreateInfoDto, type RemoveInfoDto, type UpdateInfoDto } from "./dto";

export class InfoService {
  constructor(private readonly infos: FirebaseInfoRepository) {}

  /**
   * @throws {InfoException}
   */
  async create(dto: CreateInfoDto): Promise<InfoEntity> {
    const req = await dto.validated();
    const entity = InfoEntity.new(req.order, req.field_name, req.description);
    await this.infos.create(entity);

    return entity;
  }

  /**
   * @throws {InfoException}
   */
  async findAll(): Promise<InfoEntity[]> {
    return await this.infos.findAll();
  }

  /**
   * @throws {InfoException}
   */
  async remove(dto: RemoveInfoDto): Promise<InfoEntity> {
    const req = await dto.validated();
    return await this.infos.remove(req.id);
  }

  /**
   * @throws {InfoException}
   */
  async update(dto: UpdateInfoDto): Promise<InfoEntity> {
    const req = await dto.validated();
    const entity = await this.infos.find(req.id);
    if (!entity) {
      throw InfoException.notFound(`Plant information with id ${req.id} could not be found.`);
    }

    entity.order = req.order || entity.order;
    entity.description = req.description || entity.description;
    entity.metadata.update();
    await this.infos.update(entity);

    return entity;
  }
}
