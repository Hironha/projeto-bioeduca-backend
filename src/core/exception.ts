export class Exception<C> extends Error {
  public readonly code: C;
  public readonly message: string;

  constructor(code: C, message: string) {
    super(message);
    this.code = code;
    this.message = message;
  }
}
