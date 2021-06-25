import {ValueObjectCreationError} from './errors'

export class PersonName {
  static readonly minLen = 2
  static readonly maxLen = 32

  private constructor(private readonly _value: string) {}

  static create(candidate: string): PersonName {
    if (
      candidate.length < PersonName.minLen ||
      candidate.length > PersonName.maxLen
    ) {
      const range = `${PersonName.minLen} to ${PersonName.maxLen}`
      const msg = `person name value must be ${range} charaters long`
      throw new ValueObjectCreationError(msg)
    }
    return new PersonName(candidate)
  }

  get value(): string {
    return this._value
  }
}
