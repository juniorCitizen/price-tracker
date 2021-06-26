import {BooleanValue} from '../appLayer/BooleanValue'
import {NumericValue} from '../appLayer/NumericValue'
import {StringValue} from '../appLayer/StringValue'
import {Fetching, FetchingById} from '../appLayer/TrackedAssetRepository'
import {AssetId} from '../domainLayer/AssetId'
import {TrackedAsset} from '../domainLayer/TrackedAsset'
import {GoogleSheetsRepository} from './GoogleSheetsRepository'

export class TrackedAssetGoogleSheetsRepository
  extends GoogleSheetsRepository
  implements Fetching, FetchingById
{
  private sheetAndRange = 'tracked-assets!A:K'

  constructor(options: {
    spreadsheetId: string | undefined
    credentials: string | undefined
  }) {
    super(options)
  }

  async fetchById(id: AssetId): Promise<TrackedAsset | null> {
    const trackedAssets = await this.fetch()
    const filter = this.makeFilter(id)
    const filteredAssets = trackedAssets.filter(filter)
    if (filteredAssets.length > 1) {
      const reason = `filtering by id (${id.value}) yielded multiple parameters records`
      const msg = `currupted master data (${reason})`
      throw new Error(msg)
    }
    if (filteredAssets.length === 0) {
      return null
    }
    const trackedAsset = filteredAssets[0]
    if (trackedAsset === undefined) {
      const reason = 'filtered record having undefined value unexpectedly'
      const msg = `failed to fetch asset by id (${reason})`
      throw new Error(msg)
    }
    return trackedAsset
  }

  private makeFilter(assetId: AssetId): (i: TrackedAsset) => i is TrackedAsset {
    return (trackedAsset: TrackedAsset): trackedAsset is TrackedAsset =>
      trackedAsset.id.value === assetId.value
  }

  async fetch(): Promise<TrackedAsset[]> {
    const response = await this.api.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: this.sheetAndRange,
    })
    if (response.status !== 200) {
      const {status, statusText} = response
      const reason = `${status} ${statusText}`
      const msg = `failed to fetch assets (${reason})`
      throw new Error(msg)
    }
    const rows = response.data.values
    if (!Array.isArray(rows)) {
      return []
    }
    const trackedAssets = rows.reduce(this.reduce.bind(this), [])
    const listOfIds = trackedAssets.map(asset => asset.id.value)
    if (new Set(listOfIds).size !== listOfIds.length) {
      const reason = 'multiple assets having the same id'
      const msg = `currupted master data: ${reason}`
      throw new Error(msg)
    }
    return trackedAssets
  }

  private map(row: unknown[]): TrackedAsset {
    const [
      id,
      name,
      unit,
      currency,
      decimals,
      source,
      website,
      url,
      dateSelector,
      priceSelector,
      _active,
    ] = row
    const active = Boolean(Number(_active))
    return TrackedAsset.create({
      id: StringValue.create(id).value,
      name: StringValue.create(name).value,
      unit: StringValue.create(unit).value,
      currency: StringValue.create(currency).value,
      decimals: NumericValue.create(decimals).value,
      source: StringValue.create(source).value,
      website: StringValue.create(website).value,
      url: StringValue.create(url).value,
      dateSelector: StringValue.create(dateSelector).value,
      priceSelector: StringValue.create(priceSelector).value,
      active: BooleanValue.create(active).value,
    })
  }

  private reduce(
    currentSet: TrackedAsset[],
    currentRow: unknown[],
    rowIndex: number,
  ): TrackedAsset[] {
    try {
      const mapped = this.map(currentRow)
      currentSet.push(mapped)
      return currentSet
    } catch (error) {
      if (error instanceof Error) {
        const reason = error.message
        const msg = `warning: row index ${rowIndex} has been skipped (${reason})`
        console.log(msg)
        return currentSet
      }
      throw error
    }
  }
}

export default TrackedAssetGoogleSheetsRepository
