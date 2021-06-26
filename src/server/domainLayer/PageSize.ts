import {ValueObjectCreationError} from './errors'

export class PageSize {
  static readonly max = 5000

  private constructor(private readonly _value: number) {}

  static create(candidate: number): PageSize {
    if (Number.isNaN(candidate)) {
      const msg = 'page size value must be a valid number'
      throw new ValueObjectCreationError(msg)
    }
    if (!Number.isInteger(candidate)) {
      const msg = 'page size value must be an integer'
      throw new ValueObjectCreationError(msg)
    }
    if (candidate < 0 || candidate > PageSize.max) {
      const msg = `page size value must be 0 ~ ${PageSize.max}`
      throw new ValueObjectCreationError(msg)
    }
    return new PageSize(candidate)
  }

  get value(): number {
    return this._value
  }
}
