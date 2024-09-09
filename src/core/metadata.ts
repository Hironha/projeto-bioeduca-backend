export class Metadata {
  private _createdAt: Date;
  private _updatedAt: Date;

  /**
   * @throws {Error} - Throws an `Error` if `updatedAt` is a date before `createdAt`, since
   * it's impossible to be updated but no created.
   */
  constructor(createdAt: Date, updatedAt: Date) {
    if (updatedAt < createdAt) {
      throw new Error("Metadata updatedAt cannot be a date before createdAt");
    }

    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  static new(): Metadata {
    const now = new Date();
    return new Metadata(now, now);
  }

  createdAt(): Date {
    return new Date(this._createdAt);
  }

  updatedAt(): Date {
    return new Date(this._updatedAt);
  }

  /**
   * Set `updated_at` as current date.
   */
  update(): void {
    this._updatedAt = new Date();
  }
}
