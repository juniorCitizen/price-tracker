import {EmailAddress} from '../domainLayer/EmailAddress'
import {Subscriber} from '../domainLayer/Subscriber'
import {SubscriberInfo} from '../domainLayer/SubscriberInfo'

export interface Existence {
  exists(subscriberInfo: SubscriberInfo): boolean
}

export interface Fetching {
  fetch(): Subscriber[]
}

export interface FetchingById {
  fetchById(id: EmailAddress): Subscriber | null
}

export interface Persistence {
  persist(subscriberInfo: SubscriberInfo): void
}
