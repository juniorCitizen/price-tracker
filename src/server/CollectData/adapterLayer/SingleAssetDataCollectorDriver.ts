import {
  InvalidCredentials,
  NonSubscriber,
} from '../../appLayer/SubscriberValidator'
import Interactor from '../appLayer/SingleAssetDataCollector'
import BaseDriver from './DataCollectorDriver'

export class SingleAssetDataCollectorDriver extends BaseDriver {
  async collectData(requestModel: {
    assetIdValue: unknown
    subscriberInfoValue: unknown
  }): Promise<void> {
    const {assetIdValue, subscriberInfoValue} = requestModel
    const httpResponder = this.httpResponderFactory.make()
    try {
      const assetId = Interactor.validateRequestModel(assetIdValue)
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
      await interactor.collectData(assetId)
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

export default SingleAssetDataCollectorDriver
