import { type IListPaginatedInputEntity } from "@data/interfaces/entities/listPaginatedInput";

export class ListPaginatedInputEntity implements IListPaginatedInputEntity {
	constructor({}: IListPaginatedInputEntity) {}

	export(): IListPaginatedInputEntity {
		return {};
	}
}
