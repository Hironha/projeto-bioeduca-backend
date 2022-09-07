import { type IListPaginatedInputEntity } from "@data/interfaces/entities/listPaginatedInput";

export class ListPaginatedInputEntity implements IListPaginatedInputEntity {
	perPage: number;
	page: number;

	constructor({ page, perPage }: IListPaginatedInputEntity) {
		this.page = page;
		this.perPage = perPage;
	}

	export(): IListPaginatedInputEntity {
		return {
			page: this.page,
			perPage: this.perPage,
		};
	}

	get skipAmount() {
		return this.page * this.perPage;
	}
}
