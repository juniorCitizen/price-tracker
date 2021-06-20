import {DataValidationFailure, ValueObjectCreationFailure} from './errors'

export class PageSize {
  static readonly max = 5000

  static validate(candidate: unknown): number {
    if (
      typeof candidate !== 'number' ||
      Number.isNaN(candidate) ||
      !Number.isInteger(candidate)
    ) {
      const msg = 'value of page size must be an integer if explicitly defined'
      throw new DataValidationFailure(msg)
    }
    if (candidate < 0 || candidate > PageSize.max) {
      const range = `0 ~ ${PageSize.max}`
      const msg = `page size must be ${range}`
      throw new DataValidationFailure(msg)
    }
    return candidate
  }

  private constructor(private readonly _value: number) {}

  static create(candidate: unknown): PageSize {
    try {
      const validValue = PageSize.validate(candidate)
      return new PageSize(validValue)
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
