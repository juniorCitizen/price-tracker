import {
  InvalidCredentials,
  NonSubscriber,
} from '../../appLayer/SubscriberValidator'
import Interactor from '../appLayer/AllAssetsDataCollector'
import BaseDriver from './DataCollectorDriver'

export class AllAssetsDataCollectorDriver extends BaseDriver {
  async collectData(subscriberInfoValue: unknown): Promise<void> {
    const httpResponder = this.httpResponderFactory.make()
    try {
      const interactor = new Interactor(
        this.htmlFetcher,
        this.htmlElementExtractor,
        this.dateElementParser,
        this.priceElementParser,
        this.executionLogRepository,
        this.priceRecordRepository,
        this.trackedAssetRepository,
        httpResponder,
        this.validateCredentials(subscriberInfoValue),
      )
      await interactor.collectData()
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

export default AllAssetsDataCollectorDriver
