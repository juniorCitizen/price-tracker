import {Html} from '../../domainLayer/Html'
import {TradedAssetId} from '../../domainLayer/TradedAssetId'
import {Url} from '../../domainLayer/Url'

export interface HtmlFetcher {
  execute(url: Url, transformUrlId: TradedAssetId): Promise<Html>
}
