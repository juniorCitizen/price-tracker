import {Html} from '../../domainLayer/Html'
import {HtmlElement} from '../../domainLayer/HtmlElement'
import {HtmlSelector} from '../../domainLayer/HtmlSelector'

export interface HtmlElementExtractor {
  execute(html: Html, htmlSelector: HtmlSelector): HtmlElement
}
