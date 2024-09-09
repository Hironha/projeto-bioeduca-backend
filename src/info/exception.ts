import { Exception } from "@core/exception";

export type InfoExceptionCode = "PI-001" | "PI-002" | "PI-003" | "PI-004" | "PI-010";

export class InfoException extends Exception<InfoExceptionCode> {
  static unknown(message?: string): InfoException {
    message ||= "Something went wrong.";
    return new InfoException("PI-001", message);
  }

  static validation(message?: string): InfoException {
    message ||= "Some or all the inputs are invalid.";
    return new InfoException("PI-002", message);
  }

  static duplicateName(message?: string): InfoException {
    message ||= "Could not create plant information because field name is already used.";
    return new InfoException("PI-003", message);
  }

  static notFound(message?: string): InfoException {
    message ||= "Plant information could not be found.";
    return new InfoException("PI-004", message);
  }

  static db(message?: string): InfoException {
    message ||= "Something went wrong when trying to access the database.";
    return new InfoException("PI-010", message);
  }
}
