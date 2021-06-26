import {ValueObjectCreationError} from './errors'

export type ValidSortOrderValue = 'ascending' | 'descending' | 'none'

export class SortOrder {
  private constructor(private readonly _value: ValidSortOrderValue) {}

  static create(candidate: string): SortOrder {
    if (
      candidate !== 'ascending' &&
      candidate !== 'descending' &&
      candidate !== 'none'
    ) {
      const list = '"ascending", "descending", or "none"'
      const msg = `sort order value must be one of ${list}`
      throw new ValueObjectCreationError(msg)
    }
    return new SortOrder(candidate)
  }

  get value(): ValidSortOrderValue {
    return this._value
  }
}
