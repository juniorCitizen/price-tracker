import {DataValidationFailure, ValueObjectCreationFailure} from './errors'

export class DecimalPlaces {
  static readonly max = 6

  static validate(candidate: unknown): number {
    if (
      typeof candidate !== 'number' ||
      Number.isNaN(candidate) ||
      !Number.isInteger(candidate)
    ) {
      const msg = 'value of decimal places must be an integer'
      throw new DataValidationFailure(msg)
    }
    if (candidate < 0 || candidate > DecimalPlaces.max) {
      const range = `0 ~ ${DecimalPlaces.max}`
      const msg = `decimal places must be ${range}`
      throw new DataValidationFailure(msg)
    }
    return candidate
  }

  private constructor(private readonly _value: number) {}

  static create(candidate: unknown): DecimalPlaces {
    try {
      const validValue = DecimalPlaces.validate(candidate)
      return new DecimalPlaces(validValue)
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
