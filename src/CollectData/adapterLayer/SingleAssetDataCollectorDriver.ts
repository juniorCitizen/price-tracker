import {
  InvalidCredentials,
  NonSubscriber,
} from '../../appLayer/SubscriberValidator'
import DataCollector from '../appLayer/SingleAssetDataCollector'
import DataCollectorDriver from './DataCollectorDriver'

export class SingleAssetDataCollectorDriver extends DataCollectorDriver {
  async collectData(requestModel: {
    subscriberInfo: unknown
    assetIdValue: unknown
  }): Promise<void> {
    const presenter = this.presenterFactory.make()
    try {
      this.validateCredentials(requestModel.subscriberInfo)
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
      await dataCollector.collectData(requestModel.assetIdValue)
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

export default SingleAssetDataCollectorDriver
