import {Subscriber, SubscriberDS} from '../domainLayer/Subscriber'

export interface Existence {
  exists(subscriberInfo: SubscriberDS): boolean
}

export interface Fetching {
  fetch(): Subscriber[]
}

export interface Persistence {
  persist(subscriberInfo: SubscriberDS): void
}
