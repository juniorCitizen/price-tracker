import {ValueObjectCreationError} from './errors'

export class EmailAddress {
  static readonly regExp =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  private constructor(private readonly _value: string) {}

  static create(candidate: string): EmailAddress {
    if (!EmailAddress.regExp.test(candidate)) {
      const msg = 'malformed email address'
      throw new ValueObjectCreationError(msg)
    }
    return new EmailAddress(candidate)
  }

  get value(): string {
    return this._value
  }
}
