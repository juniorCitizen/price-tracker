import {ValueObjectCreationError} from './errors'

export class ServerPort {
  private constructor(private readonly _value: number) {}

  static create(candidate: number): ServerPort {
    if (Number.isNaN(candidate)) {
      const msg = 'server port value must be a valid number'
      throw new ValueObjectCreationError(msg)
    }
    if (!Number.isInteger(candidate)) {
      const msg = 'server port value must be an integer'
      throw new ValueObjectCreationError(msg)
    }
    if (candidate < 0 || candidate > 65535) {
      const range = '0 ~ 65535'
      const msg = `server port value must be ${range}`
      throw new ValueObjectCreationError(msg)
    }
    return new ServerPort(candidate)
  }

  get value(): number {
    return this._value
  }
}
