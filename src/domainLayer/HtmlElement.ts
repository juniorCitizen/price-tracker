import {ValueObjectCreationError} from './errors'

export class HtmlElement {
  private constructor(private readonly _value: string) {}

  static create(candidate: unknown): HtmlElement {
    if (typeof candidate !== 'string') {
      const msg = 'html element value must be a string'
      throw new ValueObjectCreationError(msg)
    }
    if (candidate.length === 0) {
      const msg = 'html element value must not be an empty string'
      throw new ValueObjectCreationError(msg)
    }
    return new HtmlElement(candidate)
  }

  get value(): string {
    return this._value
  }
}
