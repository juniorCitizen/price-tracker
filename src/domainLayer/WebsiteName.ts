import {DataValidationFailure, ValueObjectCreationFailure} from './errors'

export class WebsiteName {
  static readonly minLen = 2
  static readonly maxLen = 32

  static validate(candidate: unknown): string {
    if (typeof candidate !== 'string') {
      const msg = 'value of website name must be a string'
      throw new DataValidationFailure(msg)
    }
    if (
      candidate.length < WebsiteName.minLen ||
      candidate.length > WebsiteName.maxLen
    ) {
      const msg = `website name must be ${WebsiteName.minLen} to ${WebsiteName.minLen} charaters long`
      throw new DataValidationFailure(msg)
    }
    return candidate
  }

  private constructor(private readonly _value: string) {}

  static create(candidate: unknown): WebsiteName {
    try {
      const validValue = WebsiteName.validate(candidate)
      return new WebsiteName(validValue)
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
