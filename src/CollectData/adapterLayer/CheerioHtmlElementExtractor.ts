import cheerio from 'cheerio'
import {Html} from '../../domainLayer/Html'
import {HtmlElement} from '../../domainLayer/HtmlElement'
import {HtmlSelector} from '../../domainLayer/HtmlSelector'
import {HtmlElementExtractor} from '../appLayer/HtmlElementExtractor'

export class CheerioHtmlElementExtractor implements HtmlElementExtractor {
  execute(html: Html, htmlSelector: HtmlSelector): HtmlElement {
    const htmlDocument = cheerio.load(html.value)
    const htmlElementValue = htmlDocument(htmlSelector.value).html()
    return HtmlElement.create(htmlElementValue)
  }
}

export default CheerioHtmlElementExtractor
