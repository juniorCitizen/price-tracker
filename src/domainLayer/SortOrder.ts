import {DataValidationFailure, ValueObjectCreationFailure} from './errors'

export type ValidSortOrder = 'ascending' | 'descending' | 'none'

export class SortOrder {
  static readonly defaultValue = 'none'
  static readonly list = ['ascending', 'descending', 'none']

  static validate(candidate: unknown): ValidSortOrder {
    if (candidate === undefined) {
      return SortOrder.defaultValue
    }
    if (typeof candidate !== 'string') {
      const msg = 'value of sort order must be a string if explicitly defined'
      throw new DataValidationFailure(msg)
    }
    if (
      candidate !== 'ascending' &&
      candidate !== 'descending' &&
      candidate !== 'none'
    ) {
      const list = SortOrder.list.map(i => `"${i}"`).join(', ')
      const msg = `sort order value must be one of (${list})`
      throw new DataValidationFailure(msg)
    }
    return candidate
  }

  private constructor(private readonly _value: ValidSortOrder) {}

  static create(candidate: unknown): SortOrder {
    try {
      const validValue = SortOrder.validate(candidate)
      return new SortOrder(validValue)
    } catch (error) {
      if (error instanceof DataValidationFailure) {
        throw new ValueObjectCreationFailure(error.message)
      }
      throw error
    }
  }

  get value(): ValidSortOrder {
    return this._value
  }
}
