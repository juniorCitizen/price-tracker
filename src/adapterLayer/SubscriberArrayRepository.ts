import {
  Existence,
  Fetching,
  FetchingById,
  Persistence,
} from '../appLayer/SubscriberRepository'
import {EmailAddress} from '../domainLayer/EmailAddress'
import {MaxRecordLimit} from '../domainLayer/MaxRecordLimit'
import {Subscriber} from '../domainLayer/Subscriber'
import {SubscriberInfo} from '../domainLayer/SubscriberInfo'

export type RepoEntry = Subscriber

export class SubscriberArrayRepository
  implements Existence, Fetching, FetchingById, Persistence
{
  private readonly maxRecordLimit?: MaxRecordLimit

  constructor(private subscribers: Subscriber[] = [], maxRecordLimit?: number) {
    if (maxRecordLimit !== undefined) {
      this.maxRecordLimit = MaxRecordLimit.create(maxRecordLimit)
    }
  }

  exists(subscriberInfo: SubscriberInfo): boolean {
    return this.subscribers.some(
      subscriber => subscriber.email.value === subscriberInfo.email.value,
    )
  }

  fetch(): Subscriber[] {
    return this.subscribers
  }

  fetchById(id: EmailAddress): Subscriber | null {
    const result = this.subscribers.find(
      subscriber => subscriber.email.value === id.value,
    )
    return result === undefined ? null : result
  }

  persist(subscriberInfo: SubscriberInfo): void {
    if (
      this.maxRecordLimit !== undefined &&
      this.subscribers.length === this.maxRecordLimit.value
    ) {
      const msg = `store already has maximum of ${this.maxRecordLimit.value} subscriber(s)`
      throw new Error(msg)
    }
    if (this.exists(subscriberInfo)) {
      const msg = 'email already exists'
      throw new Error(msg)
    }
    this.subscribers.push(Subscriber.create(subscriberInfo))
  }
}

export default SubscriberArrayRepository
