import { Validator } from "@utils/validator";
import { IsNotEmpty, IsString } from "class-validator";

import { type IConsultPlantDTOInput } from "@business/interfaces/ios/plant/consultPlant";

export class ConsultPlantDTO
	extends Validator<IConsultPlantDTOInput>
	implements IConsultPlantDTOInput
{
	@IsNotEmpty()
	@IsString()
	plantId: string;

	constructor(input: Partial<IConsultPlantDTOInput>) {
		super(input);
	}

	export(): IConsultPlantDTOInput {
		return {
			plantId: this.plantId,
		};
	}
}
