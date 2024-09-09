import { IsEmail, IsNotEmpty, IsString } from "class-validator";

import { Validator, type Validatable } from "@core/validate";
import { UserException } from "./exception";

export type CreateUserRequest = { email: string };

export class CreateUserDto extends Validator implements Validatable<CreateUserRequest> {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  private email: string;

  constructor(req: CreateUserRequest) {
    super();
    this.email = req.email;
  }

  async validated(): Promise<CreateUserRequest> {
    await this.validate().catch((e) => {
      console.debug("Invalid create user dto: ", e);
      throw UserException.validation();
    });

    return { email: this.email };
  }
}
