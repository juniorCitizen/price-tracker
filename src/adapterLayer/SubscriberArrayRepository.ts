import {
  Existence,
  Fetching,
  Persistence,
} from '../appLayer/SubscriberRepository'
import {MaxRecordLimit} from '../domainLayer/MaxRecordLimit'
import {Subscriber, SubscriberDS} from '../domainLayer/Subscriber'

export type SubscriberArray = SubscriberDS[]

export class SubscriberArrayRepository
  implements Existence, Fetching, Persistence
{
  private readonly maxRecordLimit?: MaxRecordLimit

  constructor(
    private dataset: SubscriberArray = [],
    options?: {
      maxRecordLimit?: number
    },
  ) {
    if (options !== undefined) {
      const {maxRecordLimit} = options as {maxRecordLimit: unknown}
      if (maxRecordLimit !== undefined) {
        this.maxRecordLimit = MaxRecordLimit.create(maxRecordLimit)
      }
    }
  }
  exists(subscriberInfo: SubscriberDS): boolean {
    return this.dataset.some(data => data.email === subscriberInfo.email)
  }

  fetch(): Subscriber[] {
    return this.dataset.map(data => Subscriber.create(data))
  }

  persist(subscriberInfo: SubscriberDS): void {
    if (
      this.maxRecordLimit !== undefined &&
      this.dataset.length === this.maxRecordLimit.value
    ) {
      const msg = `store can hold maximum of ${this.maxRecordLimit.value} subscriber(s)`
      throw new Error(msg)
    }
    this.dataset.push(subscriberInfo)
  }
}

export default SubscriberArrayRepository
