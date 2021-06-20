import {DataValidationFailure, ValueObjectCreationFailure} from './errors'

export class DataSourceName {
  static readonly minLen = 2
  static readonly maxLen = 32

  static validate(candidate: unknown): string {
    if (typeof candidate !== 'string') {
      const msg = 'value of data source name must be a string'
      throw new DataValidationFailure(msg)
    }
    if (
      candidate.length < DataSourceName.minLen ||
      candidate.length > DataSourceName.maxLen
    ) {
      const msg = `data source string must be ${DataSourceName.minLen} to ${DataSourceName.minLen} charaters long`
      throw new DataValidationFailure(msg)
    }
    return candidate
  }

  private constructor(private readonly _value: string) {}

  static create(candidate: unknown): DataSourceName {
    try {
      const validValue = DataSourceName.validate(candidate)
      return new DataSourceName(validValue)
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
