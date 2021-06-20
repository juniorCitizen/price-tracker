import {DataValidationFailure, ValueObjectCreationFailure} from './errors'

export class HtmlElement {
  static validate(candidate: unknown): string {
    if (typeof candidate !== 'string') {
      const msg = 'value of html element must be a string'
      throw new DataValidationFailure(msg)
    }
    if (candidate.length === 0) {
      const msg = 'html element must not be an empty string'
      throw new DataValidationFailure(msg)
    }
    return candidate
  }

  private constructor(private readonly _value: string) {}

  static create(candidate: unknown): HtmlElement {
    try {
      const validValue = HtmlElement.validate(candidate)
      return new HtmlElement(validValue)
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
