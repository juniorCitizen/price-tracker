import SubscriberValidator, {
  InvalidCredentials,
  NonSubscriber,
  SubscriberRepository,
} from '../../appLayer/SubscriberValidator'
import ExecutionLogEntryDisplay from '../appLayer/ExecutionLogEntryDisplay'
import {ExecutionLogEntryRepository} from '../appLayer/ExecutionLogEntryRepository'
import {HttpResponderFactory} from '../appLayer/HttpResponderFactory'

export class ExecutionLogEntryDisplayDriver {
  constructor(
    private executionLogEntryRepository: ExecutionLogEntryRepository,
    private subscriberRepository: SubscriberRepository,
    private httpResponderFactory: HttpResponderFactory,
  ) {}

  display(subscriberInfo: unknown): void {
    const httpResponder = this.httpResponderFactory.make()
    try {
      const validator = new SubscriberValidator(this.subscriberRepository)
      validator.validate(subscriberInfo)
      const executeionLogEntryDisplay = new ExecutionLogEntryDisplay(
        this.executionLogEntryRepository,
        httpResponder,
      )
      executeionLogEntryDisplay.display()
    } catch (error) {
      if (error instanceof InvalidCredentials) {
        httpResponder.badRequest(error.message)
        return
      }
      if (error instanceof NonSubscriber) {
        httpResponder.unauthorized(error.message)
        return
      }
      httpResponder.report(error)
    }
  }
}

export default ExecutionLogEntryDisplayDriver
