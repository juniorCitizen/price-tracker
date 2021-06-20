import {DataValidationFailure, ValueObjectCreationFailure} from './errors'

export class TradingPrice {
  static validate(candidate: unknown): number {
    if (typeof candidate !== 'number' || Number.isNaN(candidate)) {
      const msg = 'value of trading price must be a valid number'
      throw new DataValidationFailure(msg)
    }
    if (candidate <= 0) {
      const msg = 'trading price must be a positive number'
      throw new DataValidationFailure(msg)
    }
    return candidate
  }

  private constructor(private readonly _value: number) {}

  static create(candidate: unknown): TradingPrice {
    try {
      const validValue = TradingPrice.validate(candidate)
      return new TradingPrice(validValue)
    } catch (error) {
      if (error instanceof DataValidationFailure) {
        throw new ValueObjectCreationFailure(error.message)
      }
      throw error
    }
  }

  get value(): number {
    return this._value
  }
}
