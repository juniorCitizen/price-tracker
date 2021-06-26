import {InvalidRequestModel} from '../appLayer/errors'
import {NumericValue} from '../appLayer/NumericValue'
import {Starter} from '../appLayer/WebServer'
import {ServerPort} from '../domainLayer/ServerPort'

export type WebServer = Starter

export class WebServerStarter {
  static validateRequestModel(candidate: unknown): ServerPort {
    try {
      const numericValue = NumericValue.create(candidate).value
      return ServerPort.create(numericValue)
    } catch (error) {
      if (error instanceof Error) {
        const reason = error.message
        const msg = `(${reason})`
        throw new InvalidRequestModel(msg)
      }
      throw error
    }
  }

  constructor(private webServer: WebServer) {}

  startWebServer(serverPort: ServerPort): void {
    this.webServer.start(serverPort)
  }
}

export default WebServerStarter
