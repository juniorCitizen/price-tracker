import {DataValidationFailure, ValueObjectCreationFailure} from './errors'

export type ValidCurrencyCode = 'CNY' | 'TWD' | 'USD'

export class CurrencyCode {
  static readonly list = ['CNY', 'TWD', 'USD']

  static validate(candidate: unknown): ValidCurrencyCode {
    if (typeof candidate !== 'string') {
      const msg = 'value of currency code must be a string'
      throw new DataValidationFailure(msg)
    }
    if (candidate !== 'CNY' && candidate !== 'TWD' && candidate !== 'USD') {
      const list = CurrencyCode.list.map(i => `"${i}"`).join(', ')
      const msg = `currency code must be one of (${list})`
      throw new DataValidationFailure(msg)
    }
    return candidate
  }

  private constructor(private readonly _value: ValidCurrencyCode) {}

  static create(candidate: unknown): CurrencyCode {
    try {
      const validValue = CurrencyCode.validate(candidate)
      return new CurrencyCode(validValue)
    } catch (error) {
      if (error instanceof DataValidationFailure) {
        throw new ValueObjectCreationFailure(error.message)
      }
      throw error
    }
  }

  get value(): ValidCurrencyCode {
    return this._value
  }
}
