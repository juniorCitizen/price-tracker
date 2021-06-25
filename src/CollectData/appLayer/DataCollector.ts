import {Persistence as ExecutionLogPersistence} from '../../appLayer/ExecutionLogRepository'
import {
  BadRequest,
  Conflict,
  Forbidden,
  InternalServerError,
  NotFound,
  Ok,
  Reporting,
  Unauthorized,
} from '../../appLayer/Presenter'
import {
  Existence as PriceRecordExistence,
  Persistence as PriceRecordPersistence,
} from '../../appLayer/PriceRecordRepository'
import {
  Fetching as AssetFetching,
  FetchingById as AssetFetchingById,
} from '../../appLayer/TrackedAssetRepository'
import {AssetId} from '../../domainLayer/AssetId'
import {ExecutionResult} from '../../domainLayer/ExecutionResult'
import {Html} from '../../domainLayer/Html'
import {HtmlElement} from '../../domainLayer/HtmlElement'
import {HtmlSelector} from '../../domainLayer/HtmlSelector'
import {PricingData} from '../../domainLayer/PricingData'
import {Subscriber} from '../../domainLayer/Subscriber'
import {TrackedAsset} from '../../domainLayer/TrackedAsset'
import {TradingDate} from '../../domainLayer/TradingDate'
import {TradingPrice} from '../../domainLayer/TradingPrice'
import {Url} from '../../domainLayer/Url'

export type ExecutionLogRepository = ExecutionLogPersistence

export interface PriceRecordRepository
  extends PriceRecordExistence,
    PriceRecordPersistence {}

export interface TrackedAssetRepository
  extends AssetFetching,
    AssetFetchingById {}

export interface HtmlFetcher {
  fetch(url: Url, transformUrlId: AssetId): Promise<Html>
}

export interface HtmlElementExtractor {
  extract(html: Html, htmlSelector: HtmlSelector): HtmlElement
}

export interface DateElementParser {
  parse(htmlElement: HtmlElement, parseDateElementId: AssetId): TradingDate
}

export interface PriceElementParser {
  parse(htmlElement: HtmlElement, parsePriceElementId: AssetId): TradingPrice
}

export interface HttpResponder
  extends Ok<string>,
    InternalServerError,
    Unauthorized,
    NotFound,
    Forbidden,
    Conflict,
    BadRequest,
    Reporting<unknown> {}

export abstract class DataCollector {
  constructor(
    // services
    protected htmlFetcher: HtmlFetcher,
    protected htmlElementExtractor: HtmlElementExtractor,
    protected dateElementParser: DateElementParser,
    protected priceElementParser: PriceElementParser,
    // repositories
    protected executionLogRepository: ExecutionLogRepository,
    protected priceRecordRepository: PriceRecordRepository,
    protected trackedAssetRepository: TrackedAssetRepository,
    // presenters
    protected httpResponder: HttpResponder,
    private subscriber: Subscriber,
  ) {}

  protected async scrapeWebsite(asset: TrackedAsset): Promise<PricingData> {
    try {
      const html = await this.htmlFetcher.fetch(asset.url, asset.id)
      const tradingDate = this.dateElementParser.parse(
        this.htmlElementExtractor.extract(html, asset.dateSelector),
        asset.id,
      )
      const tradingPrice = this.priceElementParser.parse(
        this.htmlElementExtractor.extract(html, asset.priceSelector),
        asset.id,
      )
      return PricingData.create({date: tradingDate, price: tradingPrice})
    } catch (error) {
      if (error instanceof Error) {
        const reason = error.message
        const msg = `failed to scrape from ${asset.website.value} (${reason})`
        throw new WebsiteScrapingFailure(msg)
      }
      throw error
    }
  }

  protected async persistData(
    pricingData: PricingData,
    asset: TrackedAsset,
  ): Promise<void> {
    const exists = await this.priceRecordRepository.exists(
      asset.id,
      pricingData,
    )
    if (exists) {
      const date = pricingData.date.value
      const source = asset.source.value
      const name = asset.name.value
      const msg = `${date} ${source}${name} price data already exists`
      throw new RecordAlreadyExists(msg)
    }
    await this.priceRecordRepository.persist(asset.id, pricingData)
  }

  protected logSuccess(data: {
    trackedAsset: TrackedAsset
    message?: string
  }): void {
    const executionResult = ExecutionResult.create({
      subscriber: this.subscriber,
      trackedAsset: data.trackedAsset,
      success: true,
      message: data.message,
    })
    this.executionLogRepository.persist(executionResult)
  }

  protected logFailure(data: {
    trackedAsset?: TrackedAsset
    message: string
  }): void {
    const executionResult = ExecutionResult.create({
      subscriber: this.subscriber,
      trackedAsset: data.trackedAsset,
      success: false,
      message: data.message,
    })
    this.executionLogRepository.persist(executionResult)
  }
}

export class WebsiteScrapingFailure extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = 'WebsiteScrapingFailure'
    Object.setPrototypeOf(this, WebsiteScrapingFailure.prototype)
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
