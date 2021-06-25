import {StringCreationError} from './errors'

export class StringValue {
  private constructor(private readonly _value: string) {}

  static create(candidate: unknown): StringValue {
    if (candidate === undefined || candidate === null) {
      const msg = 'value must not be undefined or null'
      throw new ReferenceError(msg)
    }
    if (typeof candidate !== 'string') {
      const msg = 'value must be a string'
      throw new StringCreationError(msg)
    }
    return new StringValue(candidate)
  }

  get value(): string {
    return this._value
  }
}
