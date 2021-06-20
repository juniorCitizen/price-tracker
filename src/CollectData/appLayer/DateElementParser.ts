import {HtmlElement} from '../../domainLayer/HtmlElement'
import {TradedAssetId} from '../../domainLayer/TradedAssetId'
import {TradingDate} from '../../domainLayer/TradingDate'

export interface DateElementParser {
  execute(
    htmlElement: HtmlElement,
    parseDateElementId: TradedAssetId,
  ): TradingDate
}
