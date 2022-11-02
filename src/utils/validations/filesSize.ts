import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";

type FilesSizeOptions = {
	size: number;
};

/**
 *
 * @param options
 * accepts size property to define max size of files
 * @param validationOptions
 * value could be an array of files or a single file
 * @returns void
 */
export function FilesSize(options: FilesSizeOptions, validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: "filesSize",
			target: object.constructor,
			propertyName: propertyName,
			constraints: [object],
			options: validationOptions,
			validator: {
				validate(value: any, _: ValidationArguments) {
					if (Array.isArray(value)) {
						for (const file of value) {
							if (file?.size < options.size) return false;
						}
						return true;
					}
					return value?.size < options.size;
				},
			},
		});
	};
}
