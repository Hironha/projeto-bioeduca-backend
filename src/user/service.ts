import { UserEntity } from "./entity";
import { FirebaseUserRepository } from "./repository";
import { type CreateUserDto } from "./dto";

export class UserService {
  constructor(private readonly users: FirebaseUserRepository) {}

  /**
   * @throws {UserException}
   */
  async create(dto: CreateUserDto): Promise<void> {
    const req = await dto.validated();
    const entity = new UserEntity(req.email);
    await this.users.create(entity);
  }
}
