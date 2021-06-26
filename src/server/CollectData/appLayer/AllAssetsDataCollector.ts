import {TrackedAsset} from '../../domainLayer/TrackedAsset'
import DataCollector, {
  RecordAlreadyExists,
  WebsiteScrapingFailure,
} from './DataCollector'

export class AllAssetsDataCollector extends DataCollector {
  private async fetchTrackedAssets(): Promise<TrackedAsset[]> {
    const trackedAssets = await this.trackedAssetRepository.fetch()
    if (trackedAssets.length === 0) {
      const msg = 'no trackable asset data scraping parameters available'
      throw new NoTrackableAssets(msg)
    }
    return trackedAssets
  }

  async collectData(): Promise<void> {
    try {
      const trackedAssets = await this.fetchTrackedAssets()
      for (const trackedAsset of trackedAssets) {
        if (!trackedAsset.active.value) {
          const message = `${trackedAsset.website.value} has been marked to prevent access`
          this.logFailure({trackedAsset, message})
          continue
        }
        try {
          const pricingData = await this.scrapeWebsite(trackedAsset)
          await this.persistData(pricingData, trackedAsset)
        } catch (error) {
          let message: string
          if (error instanceof WebsiteScrapingFailure) {
            message = error.message
          }
          if (error instanceof RecordAlreadyExists) {
            message = `no need to update (${error.message})`
            this.logFailure({trackedAsset, message})
            continue
          }
          if (error instanceof Error) {
            message = `encountered unexpected error (${error.message})`
          } else {
            message = 'encountered unrecognized error'
          }
          this.logFailure({trackedAsset, message})
          continue
        }
        this.logSuccess({trackedAsset})
      }
      this.httpResponder.ok('data collection completed')
    } catch (error) {
      if (error instanceof NoTrackableAssets) {
        const message = error.message
        this.logFailure({message})
        this.httpResponder.notFound(message)
        return
      }
      const message = 'encounted unexpected message'
      this.logFailure({message})
      this.httpResponder.report(error)
    }
  }
}

export default AllAssetsDataCollector

export class NoTrackableAssets extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = 'NoTrackableAssets'
    Object.setPrototypeOf(this, NoTrackableAssets.prototype)
  }
}
