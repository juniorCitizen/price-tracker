import {ParseDateElementCache} from '../adapterLayer/GenericDateElementParser'

export const parseDateElementCache: ParseDateElementCache = {
  'boc-usd'(htmlElement: string) {
    const a = htmlElement.trim().split(' ')[0]
    if (a == undefined) {
      const msg = 'date element parser failed on 1st step'
      throw new Error(msg)
    }
    const validYear = new Date().getFullYear().toString()
    return new Date(Date.parse(`${validYear}-${a}`))
  },
  'bot-usd'(htmlElement: string) {
    const separator = '掛牌時間：'
    const a = htmlElement.split(separator)[1]
    if (a == undefined) {
      const msg = 'date element parser failed on 1st step'
      throw new Error(msg)
    }
    const b = a.split(' ').filter(i => i.length === 10)[0]
    if (b == undefined) {
      const msg = 'date element parse failed on 2nd step'
      throw new Error(msg)
    }
    return new Date(Date.parse(b))
  },
  'cbc-usd'(htmlElement: string) {
    return new Date(Date.parse(htmlElement.trim()))
  },
  'cisa-crc'(htmlElement: string) {
    return new Date(Date.parse(htmlElement.trim()))
  },
  'cisa-hrc'(htmlElement: string) {
    return new Date(Date.parse(htmlElement.trim()))
  },
  lme(htmlElement: string) {
    return new Date(Date.parse(htmlElement.replace('US$:', '').trim()))
  },
  nanhai(htmlElement: string) {
    const a = htmlElement.trim().split(' ')[0]
    if (a == undefined) {
      const msg = 'date element parser failed on 1st step'
      throw new Error(msg)
    }
    return new Date(Date.parse(a))
  },
}

export default parseDateElementCache
