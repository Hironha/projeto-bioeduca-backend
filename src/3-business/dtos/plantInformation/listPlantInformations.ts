import { Validator } from "@utils/validator";

import { type IListPlantInformationsInput } from "@business/interfaces/ios/plantInformation/listPlantInformation";

export class ListPlantInfomationsDTO
	extends Validator<IListPlantInformationsInput>
	implements IListPlantInformationsInput
{
	constructor(input: IListPlantInformationsInput) {
		super(input);
	}

	export(): IListPlantInformationsInput {
		return {};
	}
}
