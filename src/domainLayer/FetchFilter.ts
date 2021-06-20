import {DataValidationFailure, ValueObjectCreationFailure} from './errors'
import {PageNumber} from './PageNumber'
import {PageSize} from './PageSize'
import {SortOrder} from './SortOrder'

type PossibleOrderValues = 'ascending' | 'descending' | 'none'

export interface FetchFilterDS {
  readonly order: PossibleOrderValues
  readonly pageNumber: number
  readonly pageSize?: number
}

export class FetchFilter {
  static validate(candidate: unknown): FetchFilterDS {
    if (candidate === undefined || candidate === null) {
      const msg = 'value of fetch filter must be defined and not null'
      throw new DataValidationFailure(msg)
    }
    const {
      order = 'none',
      pageNumber = 1,
      pageSize,
    } = candidate as {order: unknown; pageNumber: unknown; pageSize?: unknown}
    const validOrder = SortOrder.validate(order)
    const validPageNumber = PageNumber.validate(pageNumber)
    if (pageSize === undefined && validPageNumber > 1) {
      const msg = 'page size must be defined if page number is greater than 1'
      throw new DataValidationFailure(msg)
    }
    return pageSize === undefined
      ? {order: validOrder, pageNumber: validPageNumber}
      : {
          order: validOrder,
          pageNumber: validPageNumber,
          pageSize: PageSize.validate(pageSize),
        }
  }

  private constructor(
    private readonly _order: PossibleOrderValues,
    private readonly _pageNumber: number,
    private readonly _pageSize?: number | undefined,
  ) {}

  static create(candidate: unknown): FetchFilter {
    try {
      const {order, pageNumber, pageSize} = FetchFilter.validate(candidate)
      return pageSize === undefined
        ? new FetchFilter(order, pageNumber)
        : new FetchFilter(order, pageNumber, pageSize)
    } catch (error) {
      if (error instanceof DataValidationFailure) {
        throw new ValueObjectCreationFailure(error.message)
      }
      throw error
    }
  }

  get order(): PossibleOrderValues {
    return this._order
  }

  get pageNumber(): number {
    return this._pageNumber
  }

  get pageSize(): number | undefined {
    return this._pageSize
  }

  get value(): FetchFilterDS {
    return this._pageSize === undefined
      ? {order: this._order, pageNumber: this._pageNumber}
      : {
          order: this._order,
          pageNumber: this._pageNumber,
          pageSize: this._pageSize,
        }
  }
}
