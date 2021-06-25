import SubscriberValidator, {
  InvalidCredentials,
  NonSubscriber,
  SubscriberRepository,
} from '../appLayer/SubscriberValidator'
import {Subscriber} from '../domainLayer/Subscriber'
import Interactor, {
  HttpResponder,
  PriceRecordRepository,
  ReportPresenter,
  TrackedAssetRepository,
} from './PricingReporter'

export interface ReportPresenterFactory {
  make(subscriber: Subscriber): ReportPresenter
}

export interface HttpResponderFactory {
  make(): HttpResponder
}

export class PricingReporterDriver {
  constructor(
    private priceRecordRepository: PriceRecordRepository,
    private subscriberRepository: SubscriberRepository,
    private trackedAssetRepository: TrackedAssetRepository,
    private reportPresenterFactory: ReportPresenterFactory,
    private httpResponder: HttpResponder,
  ) {}

  async report(subscriberInfoValue: unknown): Promise<void> {
    try {
      const validator = new SubscriberValidator(this.subscriberRepository)
      const subscriber = validator.validate(subscriberInfoValue)
      const interactor = new Interactor(
        this.priceRecordRepository,
        this.trackedAssetRepository,
        this.reportPresenterFactory.make(subscriber),
        this.httpResponder,
      )
      await interactor.report()
    } catch (error) {
      if (error instanceof InvalidCredentials) {
        this.httpResponder.badRequest(error.message)
        return
      }
      if (error instanceof NonSubscriber) {
        this.httpResponder.unauthorized(error.message)
        return
      }
      this.httpResponder.report(error)
    }
  }
}

export default PricingReporterDriver
