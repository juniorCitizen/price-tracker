import {AssetId} from '../domainLayer/AssetId'
import {FetchFilter} from '../domainLayer/FetchFilter'
import {PriceRecord} from '../domainLayer/PriceRecord'
import {PricingData} from '../domainLayer/PricingData'

export interface Existence {
  exists(assetId: AssetId, pricingData: PricingData): Promise<boolean>
}

export interface Fetching {
  fetch(assetId: AssetId, filter: FetchFilter): Promise<PriceRecord[]>
}

export interface Persistence {
  persist(assetId: AssetId, pricingData: PricingData): Promise<void>
}
