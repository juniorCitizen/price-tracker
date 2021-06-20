import {DataValidationFailure, ValueObjectCreationFailure} from './errors'

export class EmailAddress {
  static readonly regExp =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ // eslint-disable-line

  static validate(candidate: unknown): string {
    if (typeof candidate !== 'string') {
      const msg = 'value of email address must be a string'
      throw new DataValidationFailure(msg)
    }
    if (!EmailAddress.regExp.test(candidate)) {
      const msg = 'malformed email address'
      throw new DataValidationFailure(msg)
    }
    return candidate
  }

  private constructor(private readonly _value: string) {}

  static create(candidate: unknown): EmailAddress {
    try {
      const validValue = EmailAddress.validate(candidate)
      return new EmailAddress(validValue)
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
