import {InvalidRequestModel, StringCreationError} from '../../appLayer/errors'
import {StringValue} from '../../appLayer/StringValue'
import {AssetId} from '../../domainLayer/AssetId'
import {ValueObjectCreationError} from '../../domainLayer/errors'
import {TrackedAsset} from '../../domainLayer/TrackedAsset'
import DataCollector, {
  RecordAlreadyExists,
  WebsiteScrapingFailure,
} from './DataCollector'

export class SingleAssetDataCollector extends DataCollector {
  static validateRequestModel(requestModel: unknown): AssetId {
    try {
      const stringValue = StringValue.create(requestModel).value
      return AssetId.create(stringValue)
    } catch (error) {
      if (
        error instanceof StringCreationError ||
        error instanceof ValueObjectCreationError
      ) {
        const reason = error.message
        const msg = `invalid asset id (${reason})`
        throw new InvalidRequestModel(msg)
      }
      throw error
    }
  }

  private async fetchAsset(assetId: AssetId): Promise<TrackedAsset> {
    const asset = await this.trackedAssetRepository.fetchById(assetId)
    if (asset === null) {
      const msg = `no tracking parameters found by "${assetId.value}"`
      throw new NonExistentAsset(msg)
    }
    if (!asset.active.value) {
      const msg = `${asset.website.value} has been marked to prevent access`
      throw new InactiveAsset(msg)
    }
    return asset
  }

  async collectData(assetId: AssetId): Promise<void> {
    try {
      const trackedAsset = await this.fetchAsset(assetId)
      try {
        const pricingData = await this.scrapeWebsite(trackedAsset)
        await this.persistData(pricingData, trackedAsset)
      } catch (error) {
        if (error instanceof WebsiteScrapingFailure) {
          const message = error.message
          this.logFailure({trackedAsset, message})
          this.httpResponder.report(message)
          return
        }
        if (error instanceof RecordAlreadyExists) {
          const message = error.message
          this.logFailure({trackedAsset, message})
          this.httpResponder.conflict(message)
          return
        }
        if (error instanceof Error) {
          const message = `encountered unexpected error (${error.message})`
          this.logFailure({trackedAsset, message})
        } else {
          const message = 'encountered unrecognized error'
          this.logFailure({trackedAsset, message})
        }
        this.httpResponder.report(error)
        return
      }
      this.logSuccess({trackedAsset})
      this.httpResponder.ok('data collection completed')
    } catch (error) {
      if (error instanceof NonExistentAsset) {
        const message = error.message
        this.logFailure({message})
        this.httpResponder.notFound(message)
        return
      }
      if (error instanceof InactiveAsset) {
        const message = error.message
        this.logFailure({message})
        this.httpResponder.forbidden(error.message)
        return
      }
      if (error instanceof Error) {
        this.logFailure({message: error.message})
      } else {
        const message = 'encounted unexpected error'
        this.logFailure({message})
      }
      this.httpResponder.report(error)
    }
  }
}

export class NonExistentAsset extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = 'NonExistentAsset'
    Object.setPrototypeOf(this, NonExistentAsset.prototype)
  }
}

export class InactiveAsset extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = 'InactiveAsset'
    Object.setPrototypeOf(this, InactiveAsset.prototype)
  }
}

export default SingleAssetDataCollector
