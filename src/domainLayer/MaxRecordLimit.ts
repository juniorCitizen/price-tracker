import {ValueObjectCreationError} from './errors'

export class MaxRecordLimit {
  private constructor(private readonly _value: number) {}

  static create(candidate: number): MaxRecordLimit {
    if (Number.isNaN(candidate)) {
      const msg = 'max record limit value must be a valid number'
      throw new ValueObjectCreationError(msg)
    }
    if (!Number.isInteger(candidate)) {
      const msg = 'max record limit value must be an integer'
      throw new ValueObjectCreationError(msg)
    }
    if (candidate <= 0) {
      const msg = 'max record limit value must be positive'
      throw new ValueObjectCreationError(msg)
    }
    return new MaxRecordLimit(candidate)
  }

  get value(): number {
    return this._value
  }
}
