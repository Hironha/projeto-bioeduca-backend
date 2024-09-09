import { auth } from "firebase-admin";

import * as Model from "./model";
import { type UserEntity } from "./entity";
import { UserException } from "./exception";

export class FirebaseUserRepository {
  /**
   * @throws {UserException}
   */
  async create(entity: UserEntity): Promise<void> {
    try {
      const model = Model.fromEntity(entity);
      await auth().createUser(model);
    } catch (e: any) {
      console.error("Create user error at user repository: ", e);
      const code = e?.errorInfo?.coded;
      if (code === "auth/email-already-exists") {
        throw UserException.duplicateEmail();
      }

      throw UserException.db();
    }
  }
}
