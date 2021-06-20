import {ServerPort} from '../domainLayer/ServerPort'

export interface Starter {
  start(port: ServerPort): void
}
