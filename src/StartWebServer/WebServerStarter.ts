import {InvalidRequestModel} from '../appLayer/errors'
import {NumericValue} from '../appLayer/NumericValue'
import {Starter} from '../appLayer/WebServer'
import {ServerPort} from '../domainLayer/ServerPort'

export type WebServer = Starter

export class WebServerStarter {
  static validateRequestModel(candidate: string): ServerPort {
    try {
      const serverPortValue = NumericValue.validate(candidate)
      return ServerPort.create(serverPortValue)
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
