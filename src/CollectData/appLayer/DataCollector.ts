import {HtmlSelector} from '../../domainLayer/HtmlSelector'
import {Parameters} from '../../domainLayer/Parameters'
import {PriceRecord, PriceRecordDS} from '../../domainLayer/PriceRecord'
import {TradedAssetId} from '../../domainLayer/TradedAssetId'
import {Url} from '../../domainLayer/Url'
import {DateElementParser} from './DateElementParser'
import {ExecutionLogEntryRepository} from './ExecutionLogEntryRepository'
import {HtmlElementExtractor} from './HtmlElementExtractor'
import {HtmlFetcher} from './HtmlFetcher'
import {HttpResponder} from './HttpResponder'
import {ParametersRepository} from './ParametersRepository'
import {PriceElementParaser} from './PriceElementParser'
import {PriceRecordRepository} from './PriceRecordRepository'

export abstract class DataCollector {
  constructor(
    protected executionLogEntryRepository: ExecutionLogEntryRepository,
    protected parametersRepository: ParametersRepository,
    protected priceRecordRepository: PriceRecordRepository,
    protected htmlFetcher: HtmlFetcher,
    protected htmlElementExtractor: HtmlElementExtractor,
    protected dateElementParser: DateElementParser,
    protected priceElementParser: PriceElementParaser,
    protected httpResponder: HttpResponder,
  ) {}

  protected async scrapeWebsite(
    parameters: Parameters,
  ): Promise<PriceRecordDS> {
    try {
      const url = Url.create(parameters.siteUrl)
      const tradedAssetId = TradedAssetId.create(parameters.tradedAssetId)
      const html = await this.htmlFetcher.execute(url, tradedAssetId)
      const dateElement = this.htmlElementExtractor.execute(
        html,
        HtmlSelector.create(parameters.dateSelector),
      )
      const tradingDate = this.dateElementParser.execute(
        dateElement,
        tradedAssetId,
      )
      const priceElement = this.htmlElementExtractor.execute(
        html,
        HtmlSelector.create(parameters.priceSelector),
      )
      const tradingPrice = this.priceElementParser.execute(
        priceElement,
        tradedAssetId,
      )
      return PriceRecord.validate({
        date: tradingDate.value,
        price: tradingPrice.value,
      })
    } catch (error) {
      if (error instanceof Error) {
        const msg = `failed to scrape from ${parameters.siteName} (${error.message})`
        throw new DataScrapingFailure(msg)
      }
      throw error
    }
  }

  protected async persistData(
    priceRecordValue: PriceRecordDS,
    parameters: Parameters,
  ): Promise<void> {
    const assetId = TradedAssetId.create(parameters.tradedAssetId)
    const exists = await this.priceRecordRepository.exists(
      assetId,
      priceRecordValue,
    )
    if (exists) {
      const recordDate = priceRecordValue.date
      const dataSource = parameters.dataSource
      const assetName = parameters.tradedAssetName
      const msg = `${recordDate} ${dataSource}${assetName} price data already exists`
      throw new RecordAlreadyExists(msg)
    }
    await this.priceRecordRepository.persist(assetId, priceRecordValue)
  }

  protected log(
    _parameters: Parameters,
    success: boolean,
    message?: string,
  ): void {
    const timestamp = Date.now()
    const parameters = _parameters.value
    const payload =
      message === undefined
        ? {timestamp, parameters, success}
        : {timestamp, parameters, success, message}
    this.executionLogEntryRepository.persist(payload)
  }
}

export class DataScrapingFailure extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = 'DataScrapingFailure'
    Object.setPrototypeOf(this, DataScrapingFailure.prototype)
  }
}

export class RecordAlreadyExists extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = 'RecordAlreadyExists'
    Object.setPrototypeOf(this, RecordAlreadyExists.prototype)
  }
}

export default DataCollector
