import {ParsePriceElementCache} from '../adapterLayer/GenericPriceElementParser'

export const parsePriceElementCache: ParsePriceElementCache = {
  'boc-usd'(htmlElement: string) {
    return Number(htmlElement.trim())
  },
  'bot-usd'(htmlElement: string) {
    return Number(htmlElement.trim())
  },
  'cbc-usd'(htmlElement: string) {
    return Number(htmlElement.trim())
  },
  'cisa-crc'(htmlElement: string) {
    return Number(htmlElement.replace(',', '').trim())
  },
  'cisa-hrc'(htmlElement: string) {
    return Number(htmlElement.replace(',', '').trim())
  },
  lme(htmlElement: string) {
    return Number(htmlElement.replace(',', '').trim())
  },
  nanhai(htmlElement: string) {
    return Number(htmlElement.replace('￥', '').trim())
  },
}

export default parsePriceElementCache
