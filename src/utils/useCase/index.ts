import { Validator } from "@utils/validator";

export interface IUseCase<I extends Validator, O extends Object> {
	exec(dto: I): Promise<O>;
}
