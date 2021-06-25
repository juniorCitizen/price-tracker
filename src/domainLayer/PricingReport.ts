import {ValueObjectCreationError} from './errors'
import {PriceRecord} from './PriceRecord'
import {TrackedAsset} from './TrackedAsset'

export class PricingReport {
  private readonly _currencyFormatter: Intl.NumberFormat

  private constructor(
    private readonly _trackedAsset: TrackedAsset,
    private readonly _latest: PriceRecord,
    private readonly _previous: PriceRecord | undefined,
  ) {
    this._currencyFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this._trackedAsset.currency.value,
      currencyDisplay: 'narrowSymbol',
      minimumFractionDigits: this._trackedAsset.decimals.value,
    })
  }

  static create(candidate: {
    readonly trackedAsset: TrackedAsset
    readonly latest: PriceRecord
    readonly previous: PriceRecord | undefined
  }): PricingReport {
    try {
      const {trackedAsset, latest, previous} = candidate
      const assetId = trackedAsset.id.value
      const latestAssetId = latest.assetId.value
      if (assetId !== latestAssetId) {
        const msg = `tracked asset (${assetId}) and latest price record (${latestAssetId}) id mismatch`
        throw new Error(msg)
      }
      const previousAssetId = previous?.assetId?.value
      if (previousAssetId !== undefined && assetId !== previousAssetId) {
        const msg = `tracked asset (${assetId}) and previous price record (${previousAssetId}) id mismatch`
        throw new Error(msg)
      }
      return new PricingReport(trackedAsset, latest, previous)
    } catch (error) {
      if (error instanceof Error) {
        const reason = error.message
        const msg = `failed to create pricing report (${reason})`
        throw new ValueObjectCreationError(msg)
      }
      throw error
    }
  }

  get summary(): string {
    const date = this._latest.date.value
    const source = this._trackedAsset.source.value
    const trackedAsset = this._trackedAsset.name.value
    const price = this._latest.price.value
    const formattedPrice = this.formatCurrency(price)
    const unit = this._trackedAsset.unit.value
    const primaryInfo = `${date} ${source}${trackedAsset} ${formattedPrice}/${unit}`
    const flux =
      this._previous === undefined
        ? undefined
        : price - this._previous.price.value
    const fluxInfo =
      flux === undefined
        ? undefined
        : flux === 0
        ? '持平'
        : this.formatCurrency(flux, true)
    return fluxInfo === undefined ? primaryInfo : `${primaryInfo} (${fluxInfo})`
  }

  private formatCurrency(value: number, alwaysShowSign = false): string {
    const formatted = this._currencyFormatter.format(value)
    return !alwaysShowSign || value < 0 ? formatted : `+${formatted}`
  }
}
