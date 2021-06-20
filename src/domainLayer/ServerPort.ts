import {DataValidationFailure, ValueObjectCreationFailure} from './errors'

export class ServerPort {
  static defaultValue = 3000

  static validate(candidate: unknown): number {
    if (candidate === undefined || candidate === null) {
      return ServerPort.defaultValue
    }
    if (
      (typeof candidate !== 'string' && typeof candidate !== 'number') ||
      (typeof candidate === 'string' && typeof Number(candidate) !== 'number')
    ) {
      const msg =
        'value of server port must be a number or a number-like string'
      throw new DataValidationFailure(msg)
    }
    const numericCandidate = Number(candidate)
    if (Number.isNaN(numericCandidate) || !Number.isInteger(numericCandidate)) {
      const msg = 'value of server port must resolve to a valid integer'
      throw new DataValidationFailure(msg)
    }
    if (numericCandidate < 0 || numericCandidate > 65535) {
      const msg = `server port must be 0 ~ 65535`
      throw new DataValidationFailure(msg)
    }
    return numericCandidate
  }

  private constructor(private readonly _value: number) {}

  static create(candidate: unknown): ServerPort {
    try {
      const validValue = ServerPort.validate(candidate)
      return new ServerPort(validValue)
    } catch (error) {
      if (error instanceof DataValidationFailure) {
        throw new ValueObjectCreationFailure(error.message)
      }
      throw error
    }
  }

  get value(): number {
    return this._value
  }
}
