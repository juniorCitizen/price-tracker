import {DataValidationError, ValueObjectCreationError} from './errors'
import {PageNumber} from './PageNumber'
import {PageSize} from './PageSize'
import {SortOrder, ValidSortOrderValue} from './SortOrder'

export class FetchFilter {
  private constructor(
    private readonly _order: SortOrder,
    private readonly _pageNumber: PageNumber,
    private readonly _pageSize: PageSize | undefined,
  ) {}

  static create(
    properties: {
      readonly order?: string | SortOrder
      readonly pageNumber?: number | PageNumber
      readonly pageSize?: number | PageSize
    } = {order: 'none', pageNumber: 1},
  ): FetchFilter {
    try {
      const {
        order: _order,
        pageNumber: _pageNumber,
        pageSize: _pageSize,
      } = properties
      const order =
        _order instanceof SortOrder
          ? _order
          : SortOrder.create(_order === undefined ? 'none' : _order)
      const pageNumber =
        _pageNumber instanceof PageNumber
          ? _pageNumber
          : PageNumber.create(_pageNumber === undefined ? 1 : _pageNumber)
      if (_pageSize === undefined && pageNumber.value > 1) {
        const msg = 'page size must be defined if page number is greater than 1'
        throw new DataValidationError(msg)
      }
      const pageSize =
        _pageSize === undefined
          ? undefined
          : _pageSize instanceof PageSize
          ? _pageSize
          : PageSize.create(_pageSize)
      return new FetchFilter(order, pageNumber, pageSize)
    } catch (error) {
      if (
        error instanceof ValueObjectCreationError ||
        error instanceof DataValidationError
      ) {
        const reason = error.message
        const msg = `failed to create fetch filter (${reason})`
        throw new ValueObjectCreationError(msg)
      }
      throw error
    }
  }

  get order(): SortOrder {
    return this._order
  }

  get pageNumber(): PageNumber {
    return this._pageNumber
  }

  get pageSize(): PageSize | undefined {
    return this._pageSize
  }

  get value(): {
    readonly order: ValidSortOrderValue
    readonly pageNumber: number
    readonly pageSize: number | undefined
  } {
    return Object.freeze({
      order: this._order.value,
      pageNumber: this._pageNumber.value,
      pageSize: this._pageSize?.value,
    })
  }
}
