import {ValueObjectCreationError} from './errors'

export type ValidCurrencyCodeValue = 'CNY' | 'TWD' | 'USD'

export class CurrencyCode {
  private constructor(private readonly _value: ValidCurrencyCodeValue) {}

  static create(candidate: string): CurrencyCode {
    if (candidate !== 'CNY' && candidate !== 'TWD' && candidate !== 'USD') {
      const list = '"CNY", "TWD", or "USD"'
      const msg = `currency code value must be one of ${list}`
      throw new ValueObjectCreationError(msg)
    }
    return new CurrencyCode(candidate)
  }

  get value(): ValidCurrencyCodeValue {
    return this._value
  }
}
