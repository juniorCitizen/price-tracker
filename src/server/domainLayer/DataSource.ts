import {ValueObjectCreationError} from './errors'

export class DataSource {
  static readonly minLen = 2
  static readonly maxLen = 32

  private constructor(private readonly _value: string) {}

  static create(candidate: string): DataSource {
    if (
      candidate.length < DataSource.minLen ||
      candidate.length > DataSource.maxLen
    ) {
      const range = `${DataSource.minLen} to ${DataSource.maxLen}`
      const msg = `data source value must be ${range} charaters long`
      throw new ValueObjectCreationError(msg)
    }
    return new DataSource(candidate)
  }

  get value(): string {
    return this._value
  }
}
