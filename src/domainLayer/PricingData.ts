import {ValidCurrencyCode} from './CurrencyCode'
import {DataValidationFailure, EntityCreationFailure} from './errors'
import {Parameters, ParametersDS} from './Parameters'
import {PriceRecord, PriceRecordDS} from './PriceRecord'

export interface PriceDataDs {
  readonly parameters: ParametersDS
  readonly latest: PriceRecordDS
  readonly previous: PriceRecordDS | undefined
}

export class PriceData {
  static validate(candidate: unknown): PriceDataDs {
    if (candidate === undefined || candidate === null) {
      const msg = 'value of price data must be defined and not null'
      throw new DataValidationFailure(msg)
    }
    const {parameters, latest, previous} = candidate as {
      parameters: unknown
      latest: unknown
      previous: unknown
    }
    return {
      parameters:
        parameters instanceof Parameters
          ? parameters.value
          : Parameters.validate(parameters),
      latest:
        latest instanceof PriceRecord
          ? latest.value
          : PriceRecord.validate(latest),
      previous:
        previous === undefined
          ? undefined
          : previous instanceof PriceRecord
          ? previous.value
          : PriceRecord.validate(previous),
    }
  }

  private currencyFormatter: Intl.NumberFormat

  private constructor(
    private readonly _id: string,
    private readonly _website: string,
    private readonly _url: string,
    private readonly _dateSelector: string,
    private readonly _priceSelector: string,
    private readonly _source: string,
    private readonly _asset: string,
    private readonly _unit: string,
    private readonly _currency: ValidCurrencyCode,
    private readonly _decimals: number,
    private readonly _active: boolean,
    private readonly _latestDate: string,
    private readonly _latestPrice: number,
    private readonly _previous: PriceRecordDS | undefined,
  ) {
    this.currencyFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this._currency,
      currencyDisplay: 'narrowSymbol',
      minimumFractionDigits: this._decimals,
    })
  }

  static create(candidate: unknown): PriceData {
    try {
      const {parameters, latest, previous} = PriceData.validate(candidate)
      return new PriceData(
        parameters.id,
        parameters.website.name,
        parameters.website.url,
        parameters.website.dateSelector,
        parameters.website.priceSelector,
        parameters.asset.source,
        parameters.asset.name,
        parameters.asset.unit,
        parameters.currency.code,
        parameters.currency.decimals,
        parameters.active,
        latest.date,
        latest.price,
        previous === undefined
          ? undefined
          : {
              date: previous.date,
              price: previous.price,
            },
      )
    } catch (error) {
      if (error instanceof DataValidationFailure) {
        throw new EntityCreationFailure(error.message)
      }
      throw error
    }
  }

  private formatCurrency(value: number): string {
    return this.currencyFormatter.format(value)
  }

  get tradedAssetId(): string {
    return this._id
  }

  get siteName(): string {
    return this._website
  }

  get siteUrl(): string {
    return this._url
  }

  get dateSelector(): string {
    return this._dateSelector
  }

  get priceSelector(): string {
    return this._priceSelector
  }

  get dataSource(): string {
    return this._source
  }

  get tradedAssetName(): string {
    return this._asset
  }

  get tradedAssetUnit(): string {
    return this._unit
  }

  get currencyCode(): ValidCurrencyCode {
    return this._currency
  }

  get currencyDecimals(): number {
    return this._decimals
  }

  get activeStatus(): boolean {
    return this._active
  }

  get latestDate(): string {
    return this._latestDate
  }

  get latestPrice(): number {
    return this._latestPrice
  }

  get formattedLatestPrice(): string {
    return this.formatCurrency(this._latestPrice)
  }

  get fluxAmount(): number | undefined {
    return this._previous === undefined
      ? undefined
      : this._latestPrice - this._previous.price
  }

  get formattedFlux(): string | undefined {
    const fluxAmount =
      this._previous === undefined
        ? undefined
        : this._latestPrice - this._previous.price
    const formattedFlux =
      fluxAmount === undefined ? undefined : this.formatCurrency(fluxAmount)
    return fluxAmount === undefined || formattedFlux === undefined
      ? undefined
      : fluxAmount === 0
      ? '(持平)'
      : fluxAmount > 0
      ? `(+${formattedFlux})`
      : `(${formattedFlux})`
  }

  get summary(): string {
    const main = `${this._latestDate} ${this._source}${this._asset} ${this.formattedLatestPrice}/${this._unit}`
    return this.formattedFlux === undefined
      ? main
      : `${main} ${this.formattedFlux}`
  }
}
