export interface IException {
	message: string;
	code: string;
	httpStatus: number;
}

export interface IExceptionResponse {
	code: string;
	message: string;
}

export class Exception implements IException {
	message: string;
	httpStatus: number;
	code: string;

	constructor({ code, httpStatus, message }: IException) {
		this.code = code;
		this.httpStatus = httpStatus;
		this.message = message;
	}

	edit(props: Partial<IException>): Exception {
		const changedValues: Partial<IException> = Object.fromEntries(
			Object.entries(props).filter(([_, value]) => value !== undefined)
		);
		Object.assign(this, changedValues);
		return this;
	}

	toResponse(): IExceptionResponse {
		return { code: this.code, message: this.message };
	}
}
