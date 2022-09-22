export interface IListPaginatedEntityInput<T extends Object = {}> {
	perPage: number;
	lastKey?: string;
	searchValues?: T;
}
