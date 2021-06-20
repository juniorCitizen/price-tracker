import nodeFetch from 'node-fetch'
import {Html} from '../../domainLayer/Html'
import {TradedAssetId} from '../../domainLayer/TradedAssetId'
import {Url} from '../../domainLayer/Url'
import {HtmlFetcher} from '../appLayer/HtmlFetcher'

export interface TransformUrl {
  (url: string): string
}

export interface TransformUrlCache {
  [transformUrlIdValue: string]: TransformUrl
}

export class NodeFetchHtmlFetcher implements HtmlFetcher {
  constructor(private transformUrlCache: TransformUrlCache) {}

  async execute(url: Url, transformUrlId: TradedAssetId): Promise<Html> {
    const transformUrl = this.transformUrlCache[transformUrlId.value]
    const workingUrl =
      transformUrl === undefined ? url.value : transformUrl(url.value)
    const response = await nodeFetch(workingUrl)
    if (!response.ok) {
      const reason = `${response.status} ${response.statusText})`
      const msg = `failed http GET request to ${workingUrl} (reason: ${reason})`
      throw new Error(msg)
    }
    const htmlValue = await response.text()
    return Html.create(htmlValue)
  }
}

export default NodeFetchHtmlFetcher
