import {DataValidationFailure, ValueObjectCreationFailure} from './errors'

export class PersonName {
  static readonly minLen = 2
  static readonly maxLen = 32

  static validate(candidate: unknown): string {
    if (typeof candidate !== 'string') {
      const msg = 'value of person name must be a string'
      throw new DataValidationFailure(msg)
    }
    if (
      candidate.length < PersonName.minLen ||
      candidate.length > PersonName.maxLen
    ) {
      const msg = `person name must be ${PersonName.minLen} to ${PersonName.minLen} charaters long`
      throw new DataValidationFailure(msg)
    }
    return candidate
  }

  private constructor(private readonly _value: string) {}

  static create(candidate: unknown): PersonName {
    try {
      const validValue = PersonName.validate(candidate)
      return new PersonName(validValue)
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
