import {DataValidationFailure} from '../domainLayer/errors'
import {Subscriber} from '../domainLayer/Subscriber'
import {HttpResponder} from './HttpResponder'
import {SubscriberRepository} from './SubscriberRepository'

export class RegistrationProcessor {
  constructor(
    private subscriberRepository: SubscriberRepository,
    private httpResponder: HttpResponder,
  ) {}

  processRegistration(requestModel: unknown): void {
    try {
      let subscriberInfo
      try {
        subscriberInfo = Subscriber.validate(requestModel)
      } catch (error) {
        if (error instanceof DataValidationFailure) {
          const msg = `invalid subscriber information (${error.message})`
          this.httpResponder.badRequest(msg)
          return
        }
        throw error
      }
      if (this.subscriberRepository.exists(subscriberInfo)) {
        const msg = 'email has been registered by an existing subscriber'
        this.httpResponder.conflict(msg)
        return
      }
      this.subscriberRepository.persist(subscriberInfo)
      this.httpResponder.ok('subscribed')
    } catch (error) {
      this.httpResponder.report(error)
    }
  }
}

export default RegistrationProcessor
