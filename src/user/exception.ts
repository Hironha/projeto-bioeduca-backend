import { Exception } from "@core/exception";

export type UserExceptionCode = "CUR-001" | "CUR-002" | "CUR-010" | "CUR-011";

export class UserException extends Exception<UserExceptionCode> {
  constructor(code: UserExceptionCode, message: string) {
    super(code, message);
  }

  static unknown(message?: string): UserException {
    message ||= "Something went wrong.";
    return new UserException("CUR-001", message);
  }

  static validation(message?: string): UserException {
    message ||= "Some or all the inputs are invalid.";
    return new UserException("CUR-002", message);
  }

  static db(message?: string): UserException {
    message ||= "Something went wrong when trying to access the database.";
    return new UserException("CUR-010", message);
  }

  static duplicateEmail(message?: string): UserException {
    message ||= "The email address is already in use by another account.";
    return new UserException("CUR-011", message);
  }
}
