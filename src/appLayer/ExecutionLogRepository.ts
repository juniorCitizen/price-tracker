import {ExecutionLog} from '../domainLayer/ExecutionLog'
import {ExecutionResult} from '../domainLayer/ExecutionResult'
import {FetchFilter} from '../domainLayer/FetchFilter'

export interface Fetching {
  fetch(filter?: FetchFilter): ExecutionLog[]
}

export interface Persistence {
  persist(data: ExecutionResult): void
}
