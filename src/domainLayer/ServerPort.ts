import {DataValidationFailure, ValueObjectCreationFailure} from './errors'

export class ServerPort {
  static validate(candidate: number): number {
    if (Number.isNaN(candidate)) {
      const msg = 'server port value must be a valid number'
      throw new DataValidationFailure(msg)
    }
    if (!Number.isInteger(candidate)) {
      const msg = 'server port value must be an integer'
      throw new DataValidationFailure(msg)
    }
    if (candidate < 0 || candidate > 65535) {
      const msg = `server port value must be 0 ~ 65535`
      throw new DataValidationFailure(msg)
    }
    return candidate
  }

  private constructor(private readonly _value: number) {}

  static create(candidate: number): ServerPort {
    try {
      const serverPortValue = ServerPort.validate(candidate)
      return new ServerPort(serverPortValue)
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
