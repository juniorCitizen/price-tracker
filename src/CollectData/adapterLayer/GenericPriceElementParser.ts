import {AssetId} from '../../domainLayer/AssetId'
import {HtmlElement} from '../../domainLayer/HtmlElement'
import {TradingPrice} from '../../domainLayer/TradingPrice'
import {PriceElementParser} from '../appLayer/DataCollector'

export interface ParsePriceElement {
  (htmlElementValue: string): number
}

export interface ParsePriceElementCache {
  [parsePriceElementIdValue: string]: ParsePriceElement
}

export class GenericPriceElementParser implements PriceElementParser {
  constructor(private parsePriceElementCache: ParsePriceElementCache) {}

  parse(htmlElement: HtmlElement, parsePriceElementId: AssetId): TradingPrice {
    const parsePriceElement =
      this.parsePriceElementCache[parsePriceElementId.value]
    if (parsePriceElement === undefined) {
      const msg = `"${parsePriceElementId.value}" does not map to a parse price function`
      throw new Error(msg)
    }
    const priceValue = parsePriceElement(htmlElement.value)
    return TradingPrice.create(priceValue)
  }
}

export default GenericPriceElementParser
