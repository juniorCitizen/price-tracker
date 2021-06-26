import {EmailAddress} from '../domainLayer/EmailAddress'
import {ValueObjectCreationError} from '../domainLayer/errors'
import {Subscriber} from '../domainLayer/Subscriber'
import {StringCreationError} from './errors'
import {StringValue} from './StringValue'
import {FetchingById} from './SubscriberRepository'

export type SubscriberRepository = FetchingById

export class SubscriberValidator {
  constructor(private subscriberRepository: SubscriberRepository) {}

  validate(candidate: unknown): Subscriber {
    try {
      if (candidate === undefined || candidate === null) {
        const msg = 'subscriber value must not be undefined or null'
        throw new ReferenceError(msg)
      }
      const {email: unknownValue} = candidate as {readonly email: unknown}
      const stringValue = StringValue.create(unknownValue)
      const email = EmailAddress.create(stringValue.value)
      const result = this.subscriberRepository.fetchById(email)
      if (result === null) {
        const msg = 'subscriber authentication failure'
        throw new NonSubscriber(msg)
      }
      return result
    } catch (error) {
      if (
        error instanceof ReferenceError ||
        error instanceof StringCreationError ||
        error instanceof ValueObjectCreationError
      ) {
        const reason = error.message
        const msg = `subscriber info validation failure (${reason})`
        throw new InvalidCredentials(msg)
      }
      throw error
    }
  }
}

export default SubscriberValidator

export class InvalidCredentials extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = 'InvalidCredentials'
    Object.setPrototypeOf(this, InvalidCredentials.prototype)
  }
}

export class NonSubscriber extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = 'NonSubscriber'
    Object.setPrototypeOf(this, NonSubscriber.prototype)
  }
}
