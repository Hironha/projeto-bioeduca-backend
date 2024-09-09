import { validateOrReject, type ValidationError, type ValidatorOptions } from "class-validator";

export interface Validatable<T> {
  /**
   * @throws {Error}
   */
  validated(): Promise<T>;
}

export abstract class Validator {
  /**
   * @throws {Error} - Throws `Error` if self fails validation.
   */
  protected async validate(options?: ValidatorOptions): Promise<void> {
    try {
      await validateOrReject(this, options);
    } catch (err) {
      const errors = err as ValidationError[];
      const constraints = errors[0].constraints;

      if (constraints) {
        throw new Error(Object.values(constraints).at(0) as string);
      }
    }
  }
}
