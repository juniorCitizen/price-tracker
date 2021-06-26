import {AssetId} from '../../domainLayer/AssetId'
import {HtmlElement} from '../../domainLayer/HtmlElement'
import {TradingDate} from '../../domainLayer/TradingDate'
import {DateElementParser} from '../appLayer/DataCollector'

export interface ParseDateElement {
  (htmlElementValue: string): Date
}

export interface ParseDateElementCache {
  [parseDateElementIdValue: string]: ParseDateElement
}

export interface StringifyDate {
  (dateObject: Date): string
}

export class GenericDateElementParser implements DateElementParser {
  constructor(
    private parseDateElementCache: ParseDateElementCache,
    private stringifyDate: StringifyDate,
  ) {}

  parse(htmlElement: HtmlElement, parseDateElementId: AssetId): TradingDate {
    const parseDateElement =
      this.parseDateElementCache[parseDateElementId.value]
    if (parseDateElement === undefined) {
      const msg = `"${parseDateElementId.value}" does not map to a parse date function`
      throw new Error(msg)
    }
    const dateObject = parseDateElement(htmlElement.value)
    const dateValue = this.stringifyDate(dateObject)
    return TradingDate.create(dateValue)
  }
}

export default GenericDateElementParser
