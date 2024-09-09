import { unreachable } from "@core/unreachable";
import { type UserException } from "./exception";

export type JsonUserExceptionBody = { code: string; message: string };
export type JsonUserExceptionView = { status: number; body: JsonUserExceptionBody };
export function fromException(exception: UserException): JsonUserExceptionView {
  const body: JsonUserExceptionBody = { code: exception.code, message: exception.message };
  switch (exception.code) {
    case "CUR-001":
      return { status: 500, body };
    case "CUR-002":
      return { status: 400, body };
    case "CUR-010":
      return { status: 500, body };
    case "CUR-011":
      return { status: 409, body };
    default:
      unreachable(exception.code, "Unreachable user exception code");
      return { status: 500, body };
  }
}
