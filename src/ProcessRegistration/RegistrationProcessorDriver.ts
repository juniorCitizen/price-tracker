import {HttpResponderFactory} from './HttpResponderFactory'
import {RegistrationProcessor} from './RegistrationProcessor'
import {SubscriberRepository} from './SubscriberRepository'

export class RegistrationProcessorDriver {
  constructor(
    private subscriberRepository: SubscriberRepository,
    private httpResponderFactory: HttpResponderFactory,
  ) {}

  driveRegistrationProcessor(requestModel: unknown): void {
    const registrationProcessor = new RegistrationProcessor(
      this.subscriberRepository,
      this.httpResponderFactory.make(),
    )
    registrationProcessor.processRegistration(requestModel)
  }
}

export default RegistrationProcessorDriver
