import {ActiveSetting} from './ActiveSetting'
import {CurrencyCode, ValidCurrencyCode} from './CurrencyCode'
import {DataSourceName} from './DataSourceName'
import {DecimalPlaces} from './DecimalPlaces'
import {DataValidationFailure, EntityCreationFailure} from './errors'
import {HtmlSelector} from './HtmlSelector'
import {TradedAssetId} from './TradedAssetId'
import {TradedAssetName} from './TradedAssetName'
import {TradedAssetUnit} from './TradedAssetUnit'
import {Url} from './Url'
import {WebsiteName} from './WebsiteName'

export interface ParametersDS {
  readonly id: string
  readonly asset: {
    readonly source: string
    readonly name: string
    readonly unit: string
  }
  readonly website: {
    readonly name: string
    readonly url: string
    readonly dateSelector: string
    readonly priceSelector: string
  }
  readonly currency: {
    readonly code: ValidCurrencyCode
    readonly decimals: number
  }
  readonly active: boolean
}

export class Parameters {
  static validate(candidate: unknown): ParametersDS {
    if (candidate === undefined || candidate === null) {
      const msg = 'value of parameters must be defined and not null'
      throw new DataValidationFailure(msg)
    }
    const {id, website, asset, currency, active} = candidate as {
      id: unknown
      website: unknown
      asset: unknown
      currency: unknown
      active: unknown
    }
    if (website === undefined || website === null) {
      const msg = 'parameters must contain a valid "website" property'
      throw new DataValidationFailure(msg)
    }
    const {
      name: websiteName,
      url,
      dateSelector,
      priceSelector,
    } = website as {
      name: unknown
      url: unknown
      dateSelector: unknown
      priceSelector: unknown
    }
    if (asset === undefined || asset === null) {
      const msg = 'parameters must contain a valid "asset" property'
      throw new DataValidationFailure(msg)
    }
    const {
      source,
      name: assetName,
      unit,
    } = asset as {source: unknown; name: unknown; unit: unknown}
    if (currency === undefined || currency === null) {
      const msg = 'parameters must contain a valid "currency" property'
      throw new DataValidationFailure(msg)
    }
    const {code, decimals} = currency as {code: unknown; decimals: unknown}
    return {
      id: TradedAssetId.validate(id),
      website: {
        name: WebsiteName.validate(websiteName),
        url: Url.validate(url),
        dateSelector: HtmlSelector.validate(dateSelector),
        priceSelector: HtmlSelector.validate(priceSelector),
      },
      asset: {
        source: DataSourceName.validate(source),
        name: TradedAssetName.validate(assetName),
        unit: TradedAssetUnit.validate(unit),
      },
      currency: {
        code: CurrencyCode.validate(code),
        decimals: DecimalPlaces.validate(decimals),
      },
      active: ActiveSetting.validate(active),
    }
  }

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
  ) {}

  static create(candidate: unknown): Parameters {
    try {
      const validParametersValue = Parameters.validate(candidate)
      return new Parameters(
        validParametersValue.id,
        validParametersValue.website.name,
        validParametersValue.website.url,
        validParametersValue.website.dateSelector,
        validParametersValue.website.priceSelector,
        validParametersValue.asset.source,
        validParametersValue.asset.name,
        validParametersValue.asset.unit,
        validParametersValue.currency.code,
        validParametersValue.currency.decimals,
        validParametersValue.active,
      )
    } catch (error) {
      if (error instanceof DataValidationFailure) {
        throw new EntityCreationFailure(error.message)
      }
      throw error
    }
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

  get dateSource(): string {
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

  get value(): ParametersDS {
    return {
      id: this._id,
      website: {
        name: this._asset,
        url: this._url,
        dateSelector: this._dateSelector,
        priceSelector: this._priceSelector,
      },
      asset: {
        source: this._source,
        name: this._asset,
        unit: this._unit,
      },
      currency: {
        code: this._currency,
        decimals: this._decimals,
      },
      active: this._active,
    }
  }
}
