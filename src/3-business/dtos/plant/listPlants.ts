import { IListPlantsInput } from "@business/interfaces/ios/plant/listPlants";
import { Validator } from "@utils/validator";

export class ListPlantsDTO extends Validator<IListPlantsInput> implements IListPlantsInput {
	constructor(input: IListPlantsInput) {
		super(input);
	}

	export(): IListPlantsInput {
		return {};
	}
}
