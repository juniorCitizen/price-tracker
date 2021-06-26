import {
  BadRequest,
  InternalServerError,
  NoContent,
  Ok,
  Reporting,
  Sending,
  Unauthorized,
} from '../appLayer/Presenter'
import {Fetching as PriceRecordFetching} from '../appLayer/PriceRecordRepository'
import {Fetching as TrackedAssetFetching} from '../appLayer/TrackedAssetRepository'
import {FetchFilter} from '../domainLayer/FetchFilter'
import {PricingReport} from '../domainLayer/PricingReport'

export type TrackedAssetRepository = TrackedAssetFetching

export type PriceRecordRepository = PriceRecordFetching

export type ReportPresenter = Sending<PricingReport[]>

export interface HttpResponder
  extends Ok<string>,
    BadRequest,
    InternalServerError,
    NoContent,
    Reporting<unknown>,
    Unauthorized {}

export class PricingReporter {
  private pricingReports: PricingReport[] = []

  constructor(
    private priceRecordRepository: PriceRecordRepository,
    private trackedAssetRepository: TrackedAssetRepository,
    private reportPresenter: ReportPresenter,
    private httpResponder: HttpResponder,
  ) {}

  async report(): Promise<void> {
    try {
      const trackedAssets = await this.trackedAssetRepository.fetch()
      if (trackedAssets.length === 0) {
        const reason = 'no trackable asset data scraping parameters available'
        const msg = `no pricing data to report (${reason})`
        this.httpResponder.noContent(msg)
        return
      }
      for (const trackedAsset of trackedAssets) {
        const [latest, previous] = await this.priceRecordRepository.fetch(
          trackedAsset.id,
          FetchFilter.create({order: 'descending', pageNumber: 1, pageSize: 2}),
        )
        if (latest !== undefined) {
          const pricingReport = PricingReport.create({
            trackedAsset,
            latest,
            previous,
          })
          this.pricingReports.push(pricingReport)
        }
      }
      if (this.pricingReports.length === 0) {
        const reason = 'no pricing data exists from any tracked assets'
        const msg = `no pricing date to report (${reason})`
        this.httpResponder.noContent(msg)
        return
      }
      await this.reportPresenter.send(this.pricingReports)
      this.httpResponder.ok()
    } catch (error) {
      this.httpResponder.report(error)
    }
  }
}

export default PricingReporter

export class FailedToPresentReport extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = 'FailedToPresentReport'
    Object.setPrototypeOf(this, FailedToPresentReport.prototype)
  }
}
