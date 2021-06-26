import {ValueObjectCreationError} from './errors'

export class TradingPrice {
  private constructor(private readonly _value: number) {}

  static create(candidate: number): TradingPrice {
    if (Number.isNaN(candidate)) {
      const msg = 'trading price value must be a valid number'
      throw new ValueObjectCreationError(msg)
    }
    if (candidate <= 0) {
      const msg = 'trading price value must be positive'
      throw new ValueObjectCreationError(msg)
    }
    return new TradingPrice(candidate)
  }

  get value(): number {
    return this._value
  }
}
