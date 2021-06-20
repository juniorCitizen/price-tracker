import {HtmlElement} from '../../domainLayer/HtmlElement'
import {TradedAssetId} from '../../domainLayer/TradedAssetId'
import {TradingPrice} from '../../domainLayer/TradingPrice'
import {PriceElementParaser} from '../appLayer/PriceElementParser'

export interface ParsePriceElement {
  (htmlElementValue: string): number
}

export interface ParsePriceElementCache {
  [parsePriceElementIdValue: string]: ParsePriceElement
}

export class GenericPriceElementParser implements PriceElementParaser {
  constructor(private parsePriceElementCache: ParsePriceElementCache) {}

  execute(
    htmlElement: HtmlElement,
    parsePriceElementId: TradedAssetId,
  ): TradingPrice {
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
