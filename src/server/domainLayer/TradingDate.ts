import {ValueObjectCreationError} from './errors'

export class TradingDate {
  static readonly regExp =
    /^\d{4}([-/.])(1[012]|0[1-9])\1(0[1-9]|[12][0-9]|3[01])$/

  private constructor(private readonly _value: string) {}

  static create(candidate: string): TradingDate {
    if (!TradingDate.regExp.test(candidate)) {
      const reason = 'malformed trading date'
      throw new ValueObjectCreationError(reason)
    }
    const [yearString, monthString, dayString] = candidate.split('-') as [
      string,
      string,
      string,
    ]
    const yearValue = Number(yearString)
    const monthValue = Number(monthString)
    const dayValue = Number(dayString)
    if (['04', '06', '09', '11'].includes(monthString) && dayValue >= 31) {
      const reason =
        'trading date value must have 30 days or less during 30-day months'
      throw new ValueObjectCreationError(reason)
    }
    const isLeapYear =
      (yearValue % 4 === 0 && yearValue % 100 != 0) || yearValue % 400 === 0
    if (isLeapYear && monthValue === 2 && dayValue > 29) {
      const reason =
        'trading date value must have 29 days or less during Februarys of a leap year'
      throw new ValueObjectCreationError(reason)
    }
    if (!isLeapYear && monthValue === 2 && dayValue > 28) {
      const reason =
        'trading date value must have 28 days or less during Februarys of a common year'
      throw new ValueObjectCreationError(reason)
    }
    return new TradingDate(candidate)
  }

  get value(): string {
    return this._value
  }
}
