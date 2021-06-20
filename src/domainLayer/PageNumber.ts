import {DataValidationFailure, ValueObjectCreationFailure} from './errors'

export class PageNumber {
  static readonly defaultValue = 1

  static validate(candidate: unknown): number {
    if (candidate === undefined) {
      return PageNumber.defaultValue
    }
    if (
      typeof candidate !== 'number' ||
      Number.isNaN(candidate) ||
      !Number.isInteger(candidate)
    ) {
      const msg =
        'value of page number must be an integer if explicitly defined'
      throw new DataValidationFailure(msg)
    }
    if (candidate <= 0) {
      const msg = 'page number must be a positive integer'
      throw new DataValidationFailure(msg)
    }
    return candidate
  }

  private constructor(private readonly _value: number) {}

  static create(candidate: unknown): PageNumber {
    try {
      const validValue = PageNumber.validate(candidate)
      return new PageNumber(validValue)
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
