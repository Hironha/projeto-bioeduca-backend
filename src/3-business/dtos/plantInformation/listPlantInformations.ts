import { Validator } from "@utils/validator";

import { type IListPlantInformationsInput } from "@business/interfaces/ios/plantInformation/listPlantInformation";

export class ListPlantInfomationsDTO extends Validator implements IListPlantInformationsInput {
	constructor(input: IListPlantInformationsInput) {
		super();
	}

	export(): IListPlantInformationsInput {
		return {};
	}
}
