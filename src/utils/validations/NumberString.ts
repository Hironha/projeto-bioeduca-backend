import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";

interface INumberStringOptions {
	min?: number;
	max?: number;
	isInteger?: boolean;
}

type ValidationError = "isNumeric" | "isInteger" | "min" | "max" | undefined;

/**
 *
 * @param options
 * accepted props: min, max, isInteger.
 * min defines a minimum value, max defines a max value, isInteger verifies if its a integer
 * if neither is provided, validates only if its a numeric value
 * @param validationOptions
 * @returns
 */
export function NumberString(
	options?: INumberStringOptions,
	validationOptions?: ValidationOptions
) {
	let validationError: ValidationError;

	const validationMessages = new Map<ValidationError, string>();
	validationMessages.set("isNumeric", `$property must be numeric value`);
	validationMessages.set("isInteger", `$property must be a integer value`);
	validationMessages.set("min", `$property must be bigger than ${options?.min}`);
	validationMessages.set("max", `$property must be lesser than ${options?.max}`);

	const getValidationMessage = (errorType: ValidationError) => {
		if (!validationMessages.has(errorType)) return `$property failed numeric string validation`;
		return validationMessages.get(errorType) as string;
	};

	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: "parseNumber",
			target: object.constructor,
			propertyName: propertyName,
			constraints: [object],
			options: validationOptions,
			validator: {
				validate(value: any, args: ValidationArguments) {
					const numericValue = Number(value);
					if (isNaN(numericValue)) {
						validationError = "isNumeric";
						return false;
					}
					if (options?.isInteger && !Number.isInteger(numericValue)) {
						validationError = "isInteger";
						return false;
					}
					if (options?.min && numericValue < options.min) {
						validationError = "min";
						return false;
					}
					if (options?.max && numericValue > options.max) {
						validationError = "max";
						return false;
					}

					return true;
				},
				defaultMessage() {
					return getValidationMessage(validationError);
				},
			},
		});
	};
}
