import {AssetId} from './AssetId'
import {EntityCreationError, ValueObjectCreationError} from './errors'
import {TradingDate} from './TradingDate'
import {TradingPrice} from './TradingPrice'

export class PriceRecord {
  private constructor(
    private readonly _assetId: AssetId,
    private readonly _date: TradingDate,
    private readonly _price: TradingPrice,
  ) {}

  static create(properties: {
    readonly assetId: string | AssetId
    readonly date: string | TradingDate
    readonly price: number | TradingPrice
  }): PriceRecord {
    try {
      const {assetId, date, price} = properties
      return new PriceRecord(
        assetId instanceof AssetId ? assetId : AssetId.create(assetId),
        date instanceof TradingDate ? date : TradingDate.create(date),
        price instanceof TradingPrice ? price : TradingPrice.create(price),
      )
    } catch (error) {
      if (error instanceof ValueObjectCreationError) {
        const reason = error.message
        const msg = `failed to create price record (${reason})`
        throw new EntityCreationError(msg)
      }
      throw error
    }
  }

  get assetId(): AssetId {
    return this._assetId
  }

  get date(): TradingDate {
    return this._date
  }

  get price(): TradingPrice {
    return this._price
  }

  get value(): {
    readonly assetId: string
    readonly date: string
    readonly price: number
  } {
    return Object.freeze({
      assetId: this._assetId.value,
      date: this._date.value,
      price: this._price.value,
    })
  }
}
