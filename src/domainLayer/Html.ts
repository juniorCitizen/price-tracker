import {ValueObjectCreationError} from './errors'

export class Html {
  private constructor(private readonly _value: string) {}

  static create(candidate: unknown): Html {
    if (typeof candidate !== 'string') {
      const msg = 'value of html must be a string'
      throw new ValueObjectCreationError(msg)
    }
    if (candidate.length === 0) {
      const msg = 'html must not be an empty string'
      throw new ValueObjectCreationError(msg)
    }
    return new Html(candidate)
  }

  get value(): string {
    return this._value
  }
}
