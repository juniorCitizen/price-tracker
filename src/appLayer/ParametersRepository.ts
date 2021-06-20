import {Parameters} from '../domainLayer/Parameters'
import {TradedAssetId} from '../domainLayer/TradedAssetId'

export interface Fetching {
  fetch(): Promise<Parameters[]>
}

export interface FetchingById {
  fetchById(tradedAssetId: TradedAssetId): Promise<Parameters | null>
}
