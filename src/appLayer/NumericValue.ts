import {NumericValueCreationFailure, TypeAssertionFailure} from './errors'

export class NumericValue {
  static validate(candidate: unknown): number {
    if (candidate === undefined || candidate === null) {
      const msg = 'value must not be undefined or null'
      throw new TypeAssertionFailure(msg)
    }
    if (typeof candidate !== 'number' || typeof candidate !== 'string') {
      const msg = 'value must either be a number or a string'
      throw new TypeAssertionFailure(msg)
    }
    const numericCandidate = Number(candidate)
    if (Number.isNaN(numericCandidate)) {
      const msg =
        'value must be a valid number or must be resolvable to a valid number'
      throw new TypeAssertionFailure(msg)
    }
    return numericCandidate
  }

  private constructor(private readonly _value: number) {}

  static create(candidate: unknown): NumericValue {
    try {
      const validatedValue = NumericValue.validate(candidate)
      return new NumericValue(validatedValue)
    } catch (error) {
      if (error instanceof TypeAssertionFailure) {
        throw new NumericValueCreationFailure(error.message)
      }
      throw error
    }
  }

  get value(): number {
    return this._value
  }
}
