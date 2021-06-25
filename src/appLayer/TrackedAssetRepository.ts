import {AssetId} from '../domainLayer/AssetId'
import {TrackedAsset} from '../domainLayer/TrackedAsset'

export interface Fetching {
  fetch(): Promise<TrackedAsset[]>
}

export interface FetchingById {
  fetchById(id: AssetId): Promise<TrackedAsset | null>
}
