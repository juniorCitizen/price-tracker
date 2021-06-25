import {Fetching, Persistence} from '../appLayer/ExecutionLogRepository'
import {ExecutionLog} from '../domainLayer/ExecutionLog'
import {ExecutionResult} from '../domainLayer/ExecutionResult'
import {FetchFilter} from '../domainLayer/FetchFilter'

export type RepoEntry = ExecutionLog

export class ExecutionLogArrayRepository implements Persistence, Fetching {
  constructor(private executionLogs: ExecutionLog[] = []) {}

  persist(executionResult: ExecutionResult): void {
    this.executionLogs.push(ExecutionLog.create(executionResult))
  }

  fetch(
    filter: FetchFilter = FetchFilter.create({
      order: 'ascending',
      pageNumber: 1,
    }),
  ): ExecutionLog[] {
    if (filter.order.value === 'ascending') {
      this.executionLogs.sort(this.ascendingSorter.bind(this))
    }
    if (filter.order.value === 'descending') {
      this.executionLogs.sort(this.descendingSorter.bind(this))
    }
    if (filter.pageSize === undefined) {
      return this.executionLogs.map(this.map.bind(this))
    }
    const startIndex = filter.pageSize.value * (filter.pageNumber.value - 1)
    const endIndex = startIndex + filter.pageSize.value
    const partial = this.executionLogs.slice(startIndex, endIndex)
    return partial.map(this.map.bind(this))
  }

  private map(executionLog: ExecutionLog): ExecutionLog {
    return ExecutionLog.create(executionLog.value)
  }

  private ascendingSorter(a: ExecutionLog, b: ExecutionLog): number {
    return a.timestamp.value > b.timestamp.value
      ? 1
      : a.timestamp.value === b.timestamp.value
      ? 0
      : -1
  }

  private descendingSorter(a: ExecutionLog, b: ExecutionLog): number {
    return a.timestamp.value > b.timestamp.value
      ? -1
      : a.timestamp.value === b.timestamp.value
      ? 0
      : 1
  }
}

export default ExecutionLogArrayRepository
