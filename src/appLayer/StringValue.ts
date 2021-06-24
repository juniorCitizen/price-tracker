import {StringValueCreationFailure, TypeAssertionFailure} from './errors'

export class StringValue {
  static validate(candidate: unknown): string {
    if (candidate === undefined || candidate === null) {
      const msg = 'value must not be undefined or null'
      throw new TypeAssertionFailure(msg)
    }
    if (typeof candidate !== 'string') {
      const msg = 'value must be a string'
      throw new TypeAssertionFailure(msg)
    }
    return candidate
  }

  private constructor(private readonly _value: string) {}

  static create(candidate: unknown): StringValue {
    try {
      const validatedValue = StringValue.validate(candidate)
      return new StringValue(validatedValue)
    } catch (error) {
      if (error instanceof TypeAssertionFailure) {
        throw new StringValueCreationFailure(error.message)
      }
      throw error
    }
  }

  get value(): string {
    return this._value
  }
}
