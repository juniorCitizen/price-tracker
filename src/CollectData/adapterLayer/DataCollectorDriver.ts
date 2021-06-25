import SubscriberValidator, {
  SubscriberRepository,
} from '../../appLayer/SubscriberValidator'
import {Subscriber} from '../../domainLayer/Subscriber'
import {
  DateElementParser,
  HtmlElementExtractor,
  HtmlFetcher,
  HttpResponder,
  ExecutionLogRepository,
  PriceElementParser,
  PriceRecordRepository,
  TrackedAssetRepository,
} from '../appLayer/DataCollector'

export interface HttpResponderFactory {
  make(): HttpResponder
}

export abstract class DataCollectorDriver {
  constructor(
    // services
    protected htmlFetcher: HtmlFetcher,
    protected htmlElementExtractor: HtmlElementExtractor,
    protected dateElementParser: DateElementParser,
    protected priceElementParser: PriceElementParser,
    // repositories
    protected executionLogRepository: ExecutionLogRepository,
    protected priceRecordRepository: PriceRecordRepository,
    protected subscriberRepository: SubscriberRepository,
    protected trackedAssetRepository: TrackedAssetRepository,
    // presenters
    protected httpResponderFactory: HttpResponderFactory,
  ) {}

  protected validateCredentials(credentials: unknown): Subscriber {
    const validator = new SubscriberValidator(this.subscriberRepository)
    return validator.validate(credentials)
  }
}

export default DataCollectorDriver
