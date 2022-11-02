import { validateOrReject, ValidationError, ValidatorOptions } from "class-validator";

export abstract class Validator<T> {
	public async validate(options?: ValidatorOptions) {
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
