import {ValueObjectCreationError} from './errors'

export class Url {
  static readonly regExp =
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w\-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\\w]*))?)/

  private constructor(private readonly _value: string) {}

  static create(candidate: string): Url {
    if (!Url.regExp.test(candidate)) {
      const msg = 'malformed url'
      throw new ValueObjectCreationError(msg)
    }
    return new Url(candidate)
  }

  get value(): string {
    return this._value
  }
}
