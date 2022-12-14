interface FlowManager<T> {
	isLeft(): this is Left<T>;
	isRight(): this is Right<T>;
	export: () => T;
}

export type Either<T, R> = NonNullable<Left<T> | Right<R>>;

export class Left<T> implements FlowManager<T> {
	constructor(private value: T) {}

	isLeft(): this is Left<T> {
		return true;
	}

	isRight(): this is Right<T> {
		return false;
	}

	export() {
		return this.value;
	}
}

export class Right<T> implements FlowManager<T> {
	constructor(private value: T) {}

	isLeft(): this is Left<T> {
		return false;
	}

	isRight(): this is Right<T> {
		return true;
	}

	export() {
		return this.value;
	}
}
