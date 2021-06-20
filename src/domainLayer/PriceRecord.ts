import {DataValidationFailure, EntityCreationFailure} from './errors'
import {TradingDate} from './TradingDate'
import {TradingPrice} from './TradingPrice'

export interface PriceRecordDS {
  readonly date: string
  readonly price: number
}

export class PriceRecord {
  static validate(candidate: unknown): PriceRecordDS {
    if (candidate === undefined || candidate === null) {
      const msg = 'value of price record must be defined and not null'
      throw new DataValidationFailure(msg)
    }
    const {date, price} = candidate as {date: unknown; price: unknown}
    return {
      date: TradingDate.validate(date),
      price: TradingPrice.validate(price),
    }
  }

  private constructor(
    private readonly _date: string,
    private readonly _price: number,
  ) {}

  static create(candidate: unknown): PriceRecord {
    try {
      const {date, price} = PriceRecord.validate(candidate)
      return new PriceRecord(date, price)
    } catch (error) {
      if (error instanceof DataValidationFailure) {
        throw new EntityCreationFailure(error.message)
      }
      throw error
    }
  }

  get date(): string {
    return this._date
  }

  get price(): number {
    return this._price
  }

  get value(): PriceRecordDS {
    return {date: this._date, price: this._price}
  }
}
