import {DataValidationFailure, ValueObjectCreationFailure} from './errors'

export class TradingDate {
  static readonly regExp =
    /^\d{4}([-/.])(1[012]|0[1-9])\1(0[1-9]|[12][0-9]|3[01])$/

  static validate(candidate: unknown): string {
    if (typeof candidate !== 'string') {
      const msg = 'value of trading date must be a string'
      throw new DataValidationFailure(msg)
    }
    if (!TradingDate.regExp.test(candidate)) {
      const msg = 'malformed trading date'
      throw new DataValidationFailure(msg)
    }
    const [yearString, monthString, dayString] = candidate.split('-') as [
      string,
      string,
      string,
    ]
    const yearValue = Number(yearString)
    const monthValue = Number(monthString)
    const dayValue = Number(dayString)
    if (['04', '06', '09', '11'].includes(monthString) && dayValue === 31) {
      const msg = 'trading date has 31 days during 30-day months'
      throw new DataValidationFailure(msg)
    }
    const isLeapYear =
      (yearValue % 4 === 0 && yearValue % 100 != 0) || yearValue % 400 === 0
    if (isLeapYear && monthValue === 2 && dayValue > 29) {
      const msg = 'trading date has 30+ days February during leap year'
      throw new DataValidationFailure(msg)
    }
    if (!isLeapYear && monthValue === 2 && dayValue > 28) {
      const msg = 'trading date has 29+ days February during common year'
      throw new DataValidationFailure(msg)
    }
    return candidate
  }

  private constructor(private readonly _value: string) {}

  static create(candidate: unknown): TradingDate {
    try {
      const validValue = TradingDate.validate(candidate)
      return new TradingDate(validValue)
    } catch (error) {
      if (error instanceof DataValidationFailure) {
        throw new ValueObjectCreationFailure(error.message)
      }
      throw error
    }
  }

  get value(): string {
    return this._value
  }
}
