import {
  InvalidCredentials,
  NonSubscriber,
  SubscriberValidator,
} from '../../appLayer/SubscriberValidator'
import {HttpResponderFactory} from '../appLayer/HttpResponderFactory'
import {ParametersRepoistory} from '../appLayer/ParametersRepository'
import {PriceRecordRepository} from '../appLayer/PriceRecordRepsitory'
import PricingReporter from '../appLayer/PricingReporter'
import {ReportPresenterFactory} from '../appLayer/ReportPresenterFactory'
import {SubscriberRepository} from '../appLayer/SubscriberRepository'

export class PricingReporterDriver {
  constructor(
    private parametersRepository: ParametersRepoistory,
    private priceRecordRepository: PriceRecordRepository,
    private subscriberRepository: SubscriberRepository,
    private reportPresenterFactory: ReportPresenterFactory,
    private httpResponderFactory: HttpResponderFactory,
  ) {}

  async report(subscriberInfo: unknown): Promise<void> {
    const httpResponder = this.httpResponderFactory.make()
    try {
      const validator = new SubscriberValidator(this.subscriberRepository)
      const subscriber = validator.validate(subscriberInfo)
      const pricingReporter = new PricingReporter(
        this.parametersRepository,
        this.priceRecordRepository,
        this.reportPresenterFactory.make(subscriber),
        httpResponder,
      )
      await pricingReporter.report()
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

export default PricingReporterDriver
