export class UserEntity {
  private _email: string;

  constructor(email: string) {
    this._email = email;
  }

  email(): string {
    return this._email;
  }
}
