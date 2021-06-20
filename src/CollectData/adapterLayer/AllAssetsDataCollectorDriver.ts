import {
  InvalidCredentials,
  NonSubscriber,
} from '../../appLayer/SubscriberValidator'
import DataCollector from '../appLayer/AllAssetsDataCollector'
import DataCollectorDriver from './DataCollectorDriver'

export class AllAssetsDataCollectorDriver extends DataCollectorDriver {
  async collectData(subscriberInfo: unknown): Promise<void> {
    const presenter = this.presenterFactory.make()
    try {
      this.validateCredentials(subscriberInfo)
      const dataCollector = new DataCollector(
        this.executionLogEntryRepository,
        this.parametersRepository,
        this.priceRecordRepository,
        this.htmlFetcher,
        this.htmlElementExtractor,
        this.dateElementParser,
        this.priceElementParser,
        presenter,
      )
      await dataCollector.collectData()
    } catch (error) {
      if (error instanceof InvalidCredentials) {
        presenter.badRequest(error.message)
        return
      }
      if (error instanceof NonSubscriber) {
        presenter.unauthorized(error.message)
        return
      }
      presenter.report(error)
    }
  }
}

export default AllAssetsDataCollectorDriver
