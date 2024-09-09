export function unreachable(value: never): void;
export function unreachable(value: never, message: string): void;
export function unreachable(value: never, message?: string): void {
  message ||= `Reached unreachable case with value ${value} `;
  console.error(message);
}
