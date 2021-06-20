import {Fetching, Persistence} from '../appLayer/ExecutionLogEntryRepository'
import {
  ExecutionLogEntry,
  ExecutionLogEntryDS,
} from '../domainLayer/ExecutionLogEntry'
import {FetchFilter} from '../domainLayer/FetchFilter'

export type LogEntryArray = ExecutionLogEntryDS[]

export class ExecutionLogEntryArrayRepository implements Persistence, Fetching {
  constructor(private dataset: LogEntryArray = []) {}

  fetch(
    filter: FetchFilter = FetchFilter.create({
      order: 'ascending',
      pageNumber: 1,
      pageSize: undefined,
    }),
  ): ExecutionLogEntry[] {
    const dataset = this.dataset.map(data => ExecutionLogEntry.create(data))
    if (filter.order === 'ascending') {
      dataset.sort(this.ascendingSorter.bind(this))
    }
    if (filter.order === 'descending') {
      dataset.sort(this.descendingSorter.bind(this))
    }
    if (filter.pageSize === undefined) {
      return dataset
    }
    const startIndex = filter.pageSize * (filter.pageNumber - 1)
    const endIndex = startIndex + filter.pageSize
    return dataset.slice(startIndex, endIndex)
  }

  private ascendingSorter(a: ExecutionLogEntry, b: ExecutionLogEntry): number {
    return a.value.timestamp > b.value.timestamp
      ? 1
      : a.value.timestamp === b.value.timestamp
      ? 0
      : -1
  }

  private descendingSorter(a: ExecutionLogEntry, b: ExecutionLogEntry): number {
    return a.value.timestamp > b.value.timestamp
      ? -1
      : a.value.timestamp === b.value.timestamp
      ? 0
      : 1
  }

  persist(logEntryValue: ExecutionLogEntryDS): void {
    this.dataset.push(logEntryValue)
  }
}

export default ExecutionLogEntryArrayRepository
