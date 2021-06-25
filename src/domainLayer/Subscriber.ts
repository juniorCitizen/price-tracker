import {EmailAddress} from './EmailAddress'
import {EntityCreationError, ValueObjectCreationError} from './errors'
import {PersonName} from './PersonName'

export class Subscriber {
  private constructor(
    protected readonly _name: PersonName,
    protected readonly _email: EmailAddress,
  ) {}

  static create(candidate: {
    readonly name: string | PersonName
    readonly email: string | EmailAddress
  }): Subscriber {
    try {
      const {name, email} = candidate
      return new Subscriber(
        name instanceof PersonName ? name : PersonName.create(name),
        email instanceof EmailAddress ? email : EmailAddress.create(email),
      )
    } catch (error) {
      if (error instanceof ValueObjectCreationError) {
        const reason = error.message
        const msg = `failed to create subscriber (${reason})`
        throw new EntityCreationError(msg)
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
