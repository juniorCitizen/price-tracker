import {BooleanValueCreationFailure, TypeAssertionFailure} from './errors'

export class BooleanValue {
  static validate(candidate: unknown): boolean {
    if (candidate === undefined || candidate === null) {
      const msg = 'value must not be undefined or null'
      throw new TypeAssertionFailure(msg)
    }
    if (typeof candidate !== 'boolean') {
      const msg = 'value must be boolean'
      throw new TypeAssertionFailure(msg)
    }
    return candidate
  }

  private constructor(private readonly _value: boolean) {}

  static create(candidate: unknown): BooleanValue {
    try {
      const validatedValue = BooleanValue.validate(candidate)
      return new BooleanValue(validatedValue)
    } catch (error) {
      if (error instanceof TypeAssertionFailure) {
        throw new BooleanValueCreationFailure(error.message)
      }
      throw error
    }
  }

  get value(): boolean {
    return this._value
  }
}
