import {ActiveStatus} from './ActiveStatus'
import {AssetId} from './AssetId'
import {AssetName} from './AssetName'
import {AssetUnit} from './AssetUnit'
import {CurrencyCode, ValidCurrencyCodeValue} from './CurrencyCode'
import {DataSource} from './DataSource'
import {DecimalPlaces} from './DecimalPlaces'
import {EntityCreationError, ValueObjectCreationError} from './errors'
import {HtmlSelector} from './HtmlSelector'
import {Url} from './Url'
import {Website} from './Website'

export class TrackedAsset {
  private constructor(
    private readonly _id: AssetId,
    private readonly _name: AssetName,
    private readonly _unit: AssetUnit,
    private readonly _currency: CurrencyCode,
    private readonly _decimals: DecimalPlaces,
    private readonly _source: DataSource,
    private readonly _website: Website,
    private readonly _url: Url,
    private readonly _dateSelector: HtmlSelector,
    private readonly _priceSelector: HtmlSelector,
    private readonly _active: ActiveStatus,
  ) {}

  static create(candidate: {
    readonly id: string | AssetId
    readonly name: string | AssetName
    readonly unit: string | AssetUnit
    readonly currency: string | CurrencyCode
    readonly decimals: number | DecimalPlaces
    readonly source: string | DataSource
    readonly website: string | Website
    readonly url: string | Url
    readonly dateSelector: string | HtmlSelector
    readonly priceSelector: string | HtmlSelector
    readonly active: boolean | ActiveStatus
  }): TrackedAsset {
    try {
      return new TrackedAsset(
        candidate.id instanceof AssetId
          ? candidate.id
          : AssetId.create(candidate.id),
        candidate.name instanceof AssetName
          ? candidate.name
          : AssetName.create(candidate.name),
        candidate.unit instanceof AssetUnit
          ? candidate.unit
          : AssetUnit.create(candidate.unit),
        candidate.currency instanceof CurrencyCode
          ? candidate.currency
          : CurrencyCode.create(candidate.currency),
        candidate.decimals instanceof DecimalPlaces
          ? candidate.decimals
          : DecimalPlaces.create(candidate.decimals),
        candidate.source instanceof DataSource
          ? candidate.source
          : DataSource.create(candidate.source),
        candidate.website instanceof Website
          ? candidate.website
          : Website.create(candidate.website),
        candidate.url instanceof Url
          ? candidate.url
          : Url.create(candidate.url),
        candidate.dateSelector instanceof HtmlSelector
          ? candidate.dateSelector
          : HtmlSelector.create(candidate.dateSelector),
        candidate.priceSelector instanceof HtmlSelector
          ? candidate.priceSelector
          : HtmlSelector.create(candidate.priceSelector),
        candidate.active instanceof ActiveStatus
          ? candidate.active
          : ActiveStatus.create(candidate.active),
      )
    } catch (error) {
      if (error instanceof ValueObjectCreationError) {
        const reason = error.message
        const msg = `failed to create tracked asset (${reason})`
        throw new EntityCreationError(msg)
      }
      throw error
    }
  }

  get id(): AssetId {
    return this._id
  }

  get name(): AssetName {
    return this._name
  }

  get unit(): AssetUnit {
    return this._unit
  }

  get currency(): CurrencyCode {
    return this._currency
  }

  get decimals(): DecimalPlaces {
    return this._decimals
  }

  get source(): DataSource {
    return this._source
  }

  get website(): Website {
    return this._website
  }

  get url(): Url {
    return this._url
  }

  get dateSelector(): HtmlSelector {
    return this._dateSelector
  }

  get priceSelector(): HtmlSelector {
    return this._priceSelector
  }

  get active(): ActiveStatus {
    return this._active
  }

  get value(): {
    readonly id: string
    readonly name: string
    readonly unit: string
    readonly currency: ValidCurrencyCodeValue
    readonly decimals: number
    readonly source: string
    readonly website: string
    readonly url: string
    readonly dateSelector: string
    readonly priceSelector: string
    readonly active: boolean
  } {
    return Object.freeze({
      id: this._id.value,
      name: this._name.value,
      unit: this._unit.value,
      currency: this._currency.value,
      decimals: this._decimals.value,
      source: this._source.value,
      website: this._website.value,
      url: this._url.value,
      dateSelector: this._dateSelector.value,
      priceSelector: this._priceSelector.value,
      active: this._active.value,
    })
  }
}
