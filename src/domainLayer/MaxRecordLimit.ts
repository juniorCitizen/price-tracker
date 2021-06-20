import {DataValidationFailure, ValueObjectCreationFailure} from './errors'

export class MaxRecordLimit {
  static validate(candidate: unknown): number {
    if (
      typeof candidate !== 'number' ||
      Number.isNaN(candidate) ||
      !Number.isInteger(candidate)
    ) {
      const msg = 'value of max record limit must be an integer'
      throw new DataValidationFailure(msg)
    }
    if (candidate <= 0) {
      const msg = 'max record limit must be a positive integer'
      throw new DataValidationFailure(msg)
    }
    return candidate
  }

  private constructor(private readonly _value: number) {}

  static create(candidate?: unknown): MaxRecordLimit {
    try {
      const validValue = MaxRecordLimit.validate(candidate)
      return new MaxRecordLimit(validValue)
    } catch (error) {
      if (error instanceof DataValidationFailure) {
        throw new ValueObjectCreationFailure(error.message)
      }
      throw error
    }
  }

  get value(): number | undefined {
    return this._value
  }
}
