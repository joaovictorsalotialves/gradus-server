export class InvalidValueError extends Error {
  constructor(fieldName: string, message: string) {
    super(`Invalid value for ${fieldName}: ${message}`)
  }
}
