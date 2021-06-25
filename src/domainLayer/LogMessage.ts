import {ValueObjectCreationError} from './errors'

export class LogMessage {
  private constructor(private readonly _value: string) {}

  static create(candidate: string): LogMessage {
    if (candidate.length === 0) {
      const msg = 'log message value must be a non-empty string'
      throw new ValueObjectCreationError(msg)
    }
    return new LogMessage(candidate)
  }

  get value(): string {
    return this._value
  }
}
