import type { IListPaginatedEntityInput } from "@data/interfaces/entities/listPaginatedInput";

export class ListPaginatedInputEntity implements IListPaginatedEntityInput {
	perPage: number;
	lastKey?: string;

	constructor({ lastKey, perPage }: IListPaginatedEntityInput) {
		this.lastKey = lastKey;
		this.perPage = perPage;
	}

	export(): IListPaginatedEntityInput {
		return {
			lastKey: this.lastKey,
			perPage: this.perPage,
		};
	}
}
