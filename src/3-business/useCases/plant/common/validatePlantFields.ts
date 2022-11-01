import { isString } from "class-validator";

import { type IPlantEntity } from "@data/interfaces/entities/plant";
import { type PlantInformationModel } from "@data/models/plantInformation";

type ValidationResult =
	| {
			valid: true;
	  }
	| { valid: false; message: string };

const validatePlantField = (value: string) => {
	return isString(value);
};

const createValidResult = (): ValidationResult => ({ valid: true });

const createInvalidResult = (message: string): ValidationResult => ({ valid: false, message });

const validatePlantFields = async (
	fields: IPlantEntity['additional_informations'],
	plantInformations: PlantInformationModel[]
): Promise<ValidationResult> => {
	try {
		const informationEntries = Object.entries(fields);

		for (const [fieldName, value] of informationEntries) {
			const field = plantInformations.find(
				(plantInformation) => plantInformation.field_name === fieldName
			);

			if (!field) {
				return createInvalidResult(
					`Could not find a registered plant information for the field: ${fieldName}`
				);
			}

			if (!validatePlantField(value)) {
				return createInvalidResult(`The information ${field.field_name} must be a string`);
			}
		}

		return createValidResult();
	} catch (err) {
		return createInvalidResult("Something went wrong while trying to validate plant informations");
	}
};

export { validatePlantFields };
