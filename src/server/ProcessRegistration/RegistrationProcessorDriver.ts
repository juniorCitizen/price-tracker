import {InvalidRequestModel} from '../appLayer/errors'
import Interactor, {
  HttpResponder,
  SubscriberRepository,
} from './RegistrationProcessor'

export interface HttpResponderFactory {
  make(): HttpResponder
}

export class RegistrationProcessorDriver {
  constructor(
    private subscriberRepository: SubscriberRepository,
    private httpResponderFactory: HttpResponderFactory,
  ) {}

  driveRegistrationProcessor(requestModel: unknown): void {
    const httpResponder = this.httpResponderFactory.make()
    try {
      const subscriberInfo = Interactor.validateRequestModel(requestModel)
      const interactor = new Interactor(
        this.subscriberRepository,
        httpResponder,
      )
      interactor.processRegistration(subscriberInfo)
    } catch (error) {
      if (error instanceof InvalidRequestModel) {
        const reason = error.message
        const msg = `invalid subscriber info (${reason})`
        httpResponder.badRequest(msg)
        return
      }
      httpResponder.report(error)
    }
  }
}

export default RegistrationProcessorDriver
