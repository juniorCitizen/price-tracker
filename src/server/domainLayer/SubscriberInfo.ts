import {EmailAddress} from './EmailAddress'
import {ValueObjectCreationError} from './errors'
import {PersonName} from './PersonName'

export class SubscriberInfo {
  protected constructor(
    protected readonly _name: PersonName,
    protected readonly _email: EmailAddress,
  ) {}

  static create(properties: {
    readonly name: string | PersonName
    readonly email: string | EmailAddress
  }): SubscriberInfo {
    try {
      const {name, email} = properties
      return new SubscriberInfo(
        name instanceof PersonName ? name : PersonName.create(name),
        email instanceof EmailAddress ? email : EmailAddress.create(email),
      )
    } catch (error) {
      if (error instanceof ValueObjectCreationError) {
        const reason = error.message
        const msg = `failed to create subscriber info (${reason})`
        throw new ValueObjectCreationError(msg)
      }
      throw error
    }
  }

  get name(): PersonName {
    return this._name
  }

  get email(): EmailAddress {
    return this._email
  }

  get value(): {
    readonly name: string
    readonly email: string
  } {
    return Object.freeze({
      name: this._name.value,
      email: this._email.value,
    })
  }
}
