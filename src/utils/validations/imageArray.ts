import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";

type IsImageArrayOptions = {
	mime: ("image/jpg" | "image/png" | "image/jpeg")[];
	maxCount?: number;
};

/**
 *
 * @param options
 * available mimes: image/jpg, image/png, image/jpeg
 * @param validationOptions
 * @returns
 */
export function ImageArray(options: IsImageArrayOptions, validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: "imageArray",
			target: object.constructor,
			propertyName: propertyName,
			constraints: [options.maxCount, options.mime],
			options: validationOptions,
			validator: {
				validate(value: any, _: ValidationArguments) {
					if (value === undefined) return true;
					if (!Array.isArray(value)) return false;
					if (options.maxCount && value.length > options.maxCount) return false;

					for (const file of value) {
						if (!options.mime.includes(file.mimetype)) return false;
					}

					return true;
				},
			},
		});
	};
}
