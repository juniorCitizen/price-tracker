import {HtmlElement} from '../../domainLayer/HtmlElement'
import {TradedAssetId} from '../../domainLayer/TradedAssetId'
import {TradingPrice} from '../../domainLayer/TradingPrice'

export interface PriceElementParaser {
  execute(
    htmlElement: HtmlElement,
    parsePriceElementId: TradedAssetId,
  ): TradingPrice
}
