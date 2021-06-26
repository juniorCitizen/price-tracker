import {ValueObjectCreationError} from './errors'

export class HtmlSelector {
  private constructor(private readonly _value: string) {}

  static create(candidate: string): HtmlSelector {
    if (candidate.length === 0) {
      const msg = 'html selector value must be a non-empty string'
      throw new ValueObjectCreationError(msg)
    }
    return new HtmlSelector(candidate)
  }

  get value(): string {
    return this._value
  }
}
