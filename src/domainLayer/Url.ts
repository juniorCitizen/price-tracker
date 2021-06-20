import {DataValidationFailure, ValueObjectCreationFailure} from './errors'

export class Url {
  static readonly regExp =
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/ // eslint-disable-line

  static validate(candidate: unknown): string {
    if (typeof candidate !== 'string') {
      const msg = 'value of url must be a string'
      throw new DataValidationFailure(msg)
    }
    if (!Url.regExp.test(candidate)) {
      const msg = 'malformed url'
      throw new DataValidationFailure(msg)
    }
    return candidate
  }

  private constructor(private readonly _value: string) {}

  static create(candidate: unknown): Url {
    try {
      const validValue = Url.validate(candidate)
      return new Url(validValue)
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
