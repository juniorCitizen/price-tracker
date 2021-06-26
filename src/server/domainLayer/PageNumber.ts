import {ValueObjectCreationError} from './errors'

export class PageNumber {
  private constructor(private readonly _value: number) {}

  static create(candidate: number): PageNumber {
    if (Number.isNaN(candidate)) {
      const msg = 'page number value must be a valid number'
      throw new ValueObjectCreationError(msg)
    }
    if (!Number.isInteger(candidate)) {
      const msg = 'page number value must be an integer'
      throw new ValueObjectCreationError(msg)
    }
    if (candidate <= 0) {
      const msg = 'page number value must be positive'
      throw new ValueObjectCreationError(msg)
    }
    return new PageNumber(candidate)
  }

  get value(): number {
    return this._value
  }
}
