import {DataValidationFailure} from '../domainLayer/errors'
import {Subscriber} from '../domainLayer/Subscriber'
import {Existence} from './SubscriberRepository'

export type SubscriberRepository = Existence

export class SubscriberValidator {
  constructor(private subscriberRepository: SubscriberRepository) {}

  validate(requestModel: unknown): Subscriber {
    try {
      const subscriberInfo = Subscriber.validate(requestModel)
      const exists = this.subscriberRepository.exists(subscriberInfo)
      if (!exists) {
        const msg = 'must subscribe to access'
        throw new NonSubscriber(msg)
      }
      return Subscriber.create(subscriberInfo)
    } catch (error) {
      if (error instanceof DataValidationFailure) {
        const msg = `invalid subscriber credentials (${error.message})`
        throw new InvalidCredentials(msg)
      }
      throw error
    }
  }
}

export default SubscriberValidator

export class NonSubscriber extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = 'NonSubscriber'
    Object.setPrototypeOf(this, NonSubscriber.prototype)
  }
}

export class InvalidCredentials extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = 'InvalidCredentials'
    Object.setPrototypeOf(this, InvalidCredentials.prototype)
  }
}
