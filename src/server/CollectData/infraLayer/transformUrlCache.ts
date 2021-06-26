import {TransformUrlCache} from '../adapterLayer/NodeFetchHtmlFetcher'

export const transformUrlCache: TransformUrlCache = {
  'boc-usd'(url) {
    // if current time has passed 23:48
    // (time of Bank of China's last update of a given day)
    // then use today's date as url query
    // otherwise use yesterday's date
    // examples:
    // if current time is 2021-03-08 19:00 then result is 2021-03-07
    // if current time is 2021-03-08 23:50 then result is 2021-03-08
    // if current time is 2021-03-09 02:30 then result is 2021-03-08
    const now = new Date()
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    const todayStr = stringifyDate(now)
    const yesterdayStr = stringifyDate(yesterday)
    const closingTimeStr = `${todayStr} 23:48`
    const closingTimeValue = Date.parse(closingTimeStr)
    const closingTime = new Date(closingTimeValue)
    const queryDate = now > closingTime ? todayStr : yesterdayStr
    const dateQuery = `querydate=${queryDate}`
    return `${url}?${dateQuery}`
  },
  'bot-usd'(url) {
    // if current time has passed 16:01 (Bank of Taiwan closing time)
    // then use today's date as url parameter
    // otherwise use yesterday's date
    // examples:
    // if current time is 2021-03-08 11:00 then result is 2021-03-07
    // if current time is 2021-03-08 18:23 then result is 2021-03-08
    // if current time is 2021-03-09 03:30 then result is 2021-03-08
    const now = new Date()
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    const todayStr = stringifyDate(now)
    const yesterdayStr = stringifyDate(yesterday)
    const closingTimeStr = `${todayStr} 16:01`
    const closingTimeValue = Date.parse(closingTimeStr)
    const closingTime = new Date(closingTimeValue)
    const dateParameter = now > closingTime ? todayStr : yesterdayStr
    return `${url}/${dateParameter}`
  },
  lme(url) {
    return `${url}?timestamp=${getCacheBuster()}`
  },
}

export default transformUrlCache

function getCacheBuster(): string {
  return new Date().valueOf().toString()
}

function stringifyDate(date: Date): string {
  const dayValue = date.getDate()
  const dayString = `${dayValue < 10 ? '0' : ''}${dayValue}`
  const monthValue = date.getMonth() + 1
  const monthString = `${monthValue < 10 ? '0' : ''}${monthValue}`
  const dateString = `${date.getFullYear()}-${monthString}-${dayString}`
  return dateString
}
