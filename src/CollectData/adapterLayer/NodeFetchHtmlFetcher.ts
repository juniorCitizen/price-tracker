import nodeFetch from 'node-fetch'
import {AssetId} from '../../domainLayer/AssetId'
import {Html} from '../../domainLayer/Html'
import {Url} from '../../domainLayer/Url'
import {HtmlFetcher} from '../appLayer/DataCollector'

export interface TransformUrl {
  (url: string): string
}

export interface TransformUrlCache {
  [transformUrlIdValue: string]: TransformUrl
}

export class NodeFetchHtmlFetcher implements HtmlFetcher {
  constructor(private transformUrlCache: TransformUrlCache) {}

  async fetch(url: Url, transformUrlId: AssetId): Promise<Html> {
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
