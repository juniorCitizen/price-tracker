import {DataValidationFailure, ValueObjectCreationFailure} from './errors'

export class Html {
  static validate(candidate: unknown): string {
    if (typeof candidate !== 'string') {
      const msg = 'value of html must be a string'
      throw new DataValidationFailure(msg)
    }
    if (candidate.length === 0) {
      const msg = 'html must not be an empty string'
      throw new DataValidationFailure(msg)
    }
    return candidate
  }

  private constructor(private readonly _value: string) {}

  static create(candidate: unknown): Html {
    try {
      const validValue = Html.validate(candidate)
      return new Html(validValue)
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
