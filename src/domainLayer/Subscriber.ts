import {EmailAddress} from './EmailAddress'
import {DataValidationFailure, EntityCreationFailure} from './errors'
import {PersonName} from './PersonName'

export interface SubscriberDS {
  readonly name: string
  readonly email: string
}

export class Subscriber {
  static validate(candidate: unknown): SubscriberDS {
    if (candidate === undefined || candidate === null) {
      const msg = 'value of subscriber must be defined and not null'
      throw new DataValidationFailure(msg)
    }
    const {name, email} = candidate as {name: unknown; email: unknown}
    return {
      name: PersonName.validate(name),
      email: EmailAddress.validate(email),
    }
  }

  private constructor(
    private readonly _name: string,
    private readonly _email: string,
  ) {}

  static create(candidate: unknown): Subscriber {
    try {
      const {name, email} = Subscriber.validate(candidate)
      return new Subscriber(name, email)
    } catch (error) {
      if (error instanceof DataValidationFailure) {
        throw new EntityCreationFailure(error.name)
      }
      throw error
    }
  }

  get name(): string {
    return this._name
  }

  get email(): string {
    return this._email
  }

  get value(): SubscriberDS {
    return {
      name: this._name,
      email: this._email,
    }
  }
}
