import type { IListPaginatedEntityInput } from "@data/interfaces/entities/listPaginatedInput";

export class ListPaginatedInputEntity<T extends Object = {}> implements IListPaginatedEntityInput {
	perPage: number;
	lastKey?: string;
	searchValues?: T;

	constructor({ lastKey, perPage, searchValues }: IListPaginatedEntityInput<T>) {
		this.lastKey = lastKey;
		this.perPage = perPage;
		this.searchValues = searchValues;
	}

	export(): IListPaginatedEntityInput<T> {
		return {
			lastKey: this.lastKey,
			perPage: this.perPage,
			searchValues: this.searchValues,
		};
	}
}
