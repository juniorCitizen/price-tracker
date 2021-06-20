import {ValueObjectCreationFailure} from '../../domainLayer/errors'
import {Parameters} from '../../domainLayer/Parameters'
import {TradedAssetId} from '../../domainLayer/TradedAssetId'
import DataCollector, {
  DataScrapingFailure,
  RecordAlreadyExists,
} from './DataCollector'

export class SingleAssetDataCollector extends DataCollector {
  private async fetchParameters(assetId: TradedAssetId): Promise<Parameters> {
    const parameters = await this.parametersRepository.fetchById(assetId)
    if (parameters === null) {
      const msg = `no data collection parameters found by "${assetId.value}"`
      throw new NonExistentAsset(msg)
    }
    if (!parameters.activeStatus) {
      const msg = `${parameters.siteName} has been marked to prevent access`
      throw new InactiveAsset(msg)
    }
    return parameters
  }

  async collectData(assetIdValue: unknown): Promise<void> {
    try {
      let assetId: TradedAssetId
      try {
        assetId = TradedAssetId.create(assetIdValue)
      } catch (error) {
        if (error instanceof ValueObjectCreationFailure) {
          const msg = `invalid asset id (${error.message})`
          return this.httpResponder.badRequest(msg)
        }
        throw error
      }
      const parameters = await this.fetchParameters(assetId)
      try {
        const priceRecordData = await this.scrapeWebsite(parameters)
        await this.persistData(priceRecordData, parameters)
      } catch (error) {
        if (error instanceof DataScrapingFailure) {
          this.log(parameters, false, error.message)
          this.httpResponder.report(error.message)
          return
        }
        if (error instanceof RecordAlreadyExists) {
          this.log(parameters, false, error.message)
          this.httpResponder.conflict(error.message)
          return
        }
        if (error instanceof Error) {
          this.log(
            parameters,
            false,
            `encountered unexpected error (${error.message})`,
          )
        } else {
          this.log(parameters, false, 'encountered unrecognized error')
        }
        this.httpResponder.report(error)
        return
      }
      this.log(parameters, true)
      this.httpResponder.ok('data collection completed')
    } catch (error) {
      if (error instanceof NonExistentAsset) {
        this.httpResponder.notFound(error.message)
        return
      }
      if (error instanceof InactiveAsset) {
        this.httpResponder.forbidden(error.message)
        return
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
