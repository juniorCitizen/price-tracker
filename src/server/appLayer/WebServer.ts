import {ServerPort} from '../domainLayer/ServerPort'

export interface Starter {
  start(serverPort: ServerPort): void
}
