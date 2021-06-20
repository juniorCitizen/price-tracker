import SubscriberValidator, {
  InvalidCredentials,
  NonSubscriber,
  SubscriberRepository,
} from '../../appLayer/SubscriberValidator'
import {Subscriber} from '../../domainLayer/Subscriber'
import {DateElementParser} from '../appLayer/DateElementParser'
import {ExecutionLogEntryRepository} from '../appLayer/ExecutionLogEntryRepository'
import {HtmlElementExtractor} from '../appLayer/HtmlElementExtractor'
import {HtmlFetcher} from '../appLayer/HtmlFetcher'
import {HttpResponderFactory} from '../appLayer/HttpResponderFactory'
import {ParametersRepository} from '../appLayer/ParametersRepository'
import {PriceElementParaser} from '../appLayer/PriceElementParser'
import {PriceRecordRepository} from '../appLayer/PriceRecordRepository'

export abstract class DataCollectorDriver {
  constructor(
    protected executionLogEntryRepository: ExecutionLogEntryRepository,
    protected parametersRepository: ParametersRepository,
    protected priceRecordRepository: PriceRecordRepository,
    protected subscriberRepository: SubscriberRepository,
    protected htmlFetcher: HtmlFetcher,
    protected htmlElementExtractor: HtmlElementExtractor,
    protected dateElementParser: DateElementParser,
    protected priceElementParser: PriceElementParaser,
    protected presenterFactory: HttpResponderFactory,
  ) {}

  protected validateCredentials(
    credentials: unknown,
  ): Subscriber | NonSubscriber | InvalidCredentials {
    const validator = new SubscriberValidator(this.subscriberRepository)
    return validator.validate(credentials)
  }
}

export default DataCollectorDriver
