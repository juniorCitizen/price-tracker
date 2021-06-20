import {
  ExecutionLogEntry,
  ExecutionLogEntryDS,
} from '../domainLayer/ExecutionLogEntry'
import {FetchFilter} from '../domainLayer/FetchFilter'

export interface Fetching {
  fetch(filter?: FetchFilter): ExecutionLogEntry[]
}

export interface Persistence {
  persist(executionLogEntryValue: ExecutionLogEntryDS): void
}
