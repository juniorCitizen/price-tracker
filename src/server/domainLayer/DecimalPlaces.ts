import {ValueObjectCreationError} from './errors'

export class DecimalPlaces {
  static readonly max = 6

  private constructor(private readonly _value: number) {}

  static create(candidate: number): DecimalPlaces {
    if (Number.isNaN(candidate)) {
      const msg = 'decimal places value must be a valid number'
      throw new ValueObjectCreationError(msg)
    }
    if (!Number.isInteger(candidate)) {
      const msg = 'decimal places value must be an integer'
      throw new ValueObjectCreationError(msg)
    }
    if (candidate < 0 || candidate > DecimalPlaces.max) {
      const range = `0 ~ ${DecimalPlaces.max}`
      const msg = `decimal places value must be ${range}`
      throw new ValueObjectCreationError(msg)
    }
    return new DecimalPlaces(candidate)
  }

  get value(): number {
    return this._value
  }
}
