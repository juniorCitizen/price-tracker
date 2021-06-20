import {FetchFilter} from '../domainLayer/FetchFilter'
import {PriceRecord, PriceRecordDS} from '../domainLayer/PriceRecord'
import {TradedAssetId} from '../domainLayer/TradedAssetId'

export interface Existence {
  exists(
    tradedAssetId: TradedAssetId,
    priceRecordValue: PriceRecordDS,
  ): Promise<boolean>
}

export interface Fetching {
  fetch(
    tradedAssetId: TradedAssetId,
    filter: FetchFilter,
  ): Promise<PriceRecord[]>
}

export interface Persistence {
  persist(
    tradedAssetId: TradedAssetId,
    priceRecordValue: PriceRecordDS,
  ): Promise<void>
}
