import {Express, RequestHandler} from 'express'
import ExecutionLogRepository from '../adapterLayer/ExecutionLogArrayRepository'
import PriceRecordRepository from '../adapterLayer/PriceRecordGoogleSheetsRepository'
import SubscriberRepository from '../adapterLayer/SubscriberArrayRepository'
import TrackedAssetRepository from '../adapterLayer/TrackedAssetGoogleSheetsRepository'
import HtmlElementExtractor from './adapterLayer/CheerioHtmlElementExtractor'
import PresenterFactory from './adapterLayer/ExpressHttpResponderFactory'
import DateElementParser, {
  StringifyDate,
} from './adapterLayer/GenericDateElementParser'
import PriceElementParser from './adapterLayer/GenericPriceElementParser'
import HtmlFetcher from './adapterLayer/NodeFetchHtmlFetcher'
import Driver from './adapterLayer/SingleAssetDataCollectorDriver'
import parseDateElementCache from './infraLayer/parseDateElementCache'
import parsePriceElementCache from './infraLayer/parsePriceElementCache'
import transformUrlCache from './infraLayer/transformUrlCache'

export function enableCollectOne(
  routePath: string,
  httpVerb: 'get' | 'post',
  dependencies: {
    app: Express
    stringifyDate: StringifyDate
    executionLogRepository: ExecutionLogRepository
    priceRecordRepository: PriceRecordRepository
    subscriberRepository: SubscriberRepository
    trackedAssetRepository: TrackedAssetRepository
  },
): void {
  const requestHandler: RequestHandler = async (req, res, next) => {
    const driver = new Driver(
      new HtmlFetcher(transformUrlCache),
      new HtmlElementExtractor(),
      new DateElementParser(parseDateElementCache, dependencies.stringifyDate),
      new PriceElementParser(parsePriceElementCache),
      dependencies.executionLogRepository,
      dependencies.priceRecordRepository,
      dependencies.subscriberRepository,
      dependencies.trackedAssetRepository,
      new PresenterFactory(req, res, next),
    )
    await driver.collectData({
      subscriberInfoValue: req.body as unknown,
      assetIdValue: req.params['assetId'],
    })
  }
  dependencies.app[httpVerb](routePath, requestHandler)
}

export default enableCollectOne
