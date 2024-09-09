import { Exception } from "@core/exception";

export type PlantExceptionCode = "PL-002" | "PL-003" | "PL-010" | "PL-011" | "PL-012";

export class PlantException extends Exception<PlantExceptionCode> {
  constructor(code: PlantExceptionCode, message: string) {
    super(code, message);
  }

  static notFound(message?: string): PlantException {
    message ||= "Plant could not be found.";
    return new PlantException("PL-003", message);
  }

  static validation(message?: string): PlantException {
    message ||= "Some or all the inputs are invalid.";
    return new PlantException("PL-002", message);
  }

  static db(message?: string): PlantException {
    message ||= "Something went wrong when trying to access the database.";
    return new PlantException("PL-010", message);
  }

  static storage(message?: string): PlantException {
    message ||= "Something went wrong when trying to access storage.";
    return new PlantException("PL-011", message);
  }

  static unknown(message?: string): PlantException {
    message ||= "Something went wrong.";
    return new PlantException("PL-012", message);
  }
}
