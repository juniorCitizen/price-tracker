import {ValueObjectCreationError} from './errors'
import {TradingDate} from './TradingDate'
import {TradingPrice} from './TradingPrice'

export class PricingData {
  protected constructor(
    protected readonly _date: TradingDate,
    protected readonly _price: TradingPrice,
  ) {}

  static create(properties: {
    readonly date: string | TradingDate
    readonly price: number | TradingPrice
  }): PricingData {
    try {
      const {date, price} = properties
      return new PricingData(
        date instanceof TradingDate ? date : TradingDate.create(date),
        price instanceof TradingPrice ? price : TradingPrice.create(price),
      )
    } catch (error) {
      if (error instanceof ValueObjectCreationError) {
        const reason = error.message
        const msg = `failed to create pricing data (${reason})`
        throw new ValueObjectCreationError(msg)
      }
      throw error
    }
  }

  get date(): TradingDate {
    return this._date
  }

  get price(): TradingPrice {
    return this._price
  }

  get value(): {
    readonly date: string
    readonly price: number
  } {
    return Object.freeze({
      date: this._date.value,
      price: this._price.value,
    })
  }
}
