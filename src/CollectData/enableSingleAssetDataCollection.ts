import {Express, RequestHandler} from 'express'
import {SubscriberRepository} from '../appLayer/SubscriberValidator'
import stringifyDate from '../infraLayer/stringifyDate'
import Driver from './adapterLayer/SingleAssetDataCollectorDriver'
import HtmlElementExtractor from './adapterLayer/CheerioHtmlElementExtractor'
import PresenterFactory from './adapterLayer/ExpressHttpResponderFactory'
import DateElementParser from './adapterLayer/GenericDateElementParser'
import PriceElementParser from './adapterLayer/GenericPriceElementParser'
import HtmlFetcher from './adapterLayer/NodeFetchHtmlFetcher'
import {ExecutionLogEntryRepository} from './appLayer/ExecutionLogEntryRepository'
import {ParametersRepository} from './appLayer/ParametersRepository'
import {PriceRecordRepository} from './appLayer/PriceRecordRepository'
import {parseDateElementCache} from './infraLayer/parseDateElementCache'
import {parsePriceElementCache} from './infraLayer/parsePriceElementCache'
import transformUrlCache from './infraLayer/transformUrlCache'

export function enableSingleAssetDataCollection(
  routePath: string,
  httpVerb: 'get' | 'post',
  dependencies: {
    app: Express
    executionLogEntryRepository: ExecutionLogEntryRepository
    parametersRepository: ParametersRepository
    priceRecordRepository: PriceRecordRepository
    subscriberRepository: SubscriberRepository
  },
): void {
  const requestHandler: RequestHandler = async (req, res, next) => {
    const driver = new Driver(
      dependencies.executionLogEntryRepository,
      dependencies.parametersRepository,
      dependencies.priceRecordRepository,
      dependencies.subscriberRepository,
      new HtmlFetcher(transformUrlCache),
      new HtmlElementExtractor(),
      new DateElementParser(parseDateElementCache, stringifyDate),
      new PriceElementParser(parsePriceElementCache),
      new PresenterFactory(req, res, next),
    )
    await driver.collectData({
      subscriberInfo: req.body as unknown,
      assetIdValue: req.params['assetId'],
    })
  }
  dependencies.app[httpVerb](routePath, requestHandler)
}

export default enableSingleAssetDataCollection
