import { UserEntity } from "./entity";

export type UserModel = {
  email: string;
};

export function fromEntity(entity: UserEntity): UserModel {
  return {
    email: entity.email(),
  };
}

export function toEntity(model: UserModel): UserEntity {
  return new UserEntity(model.email);
}
