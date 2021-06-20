import {Starter} from '../appLayer/WebServer'
import {ServerPort} from '../domainLayer/ServerPort'

export type WebServer = Starter

export class WebServerStarter {
  constructor(private webServer: WebServer) {}

  start(serverPortValue: string | number | undefined): void {
    const serverPort = ServerPort.create(serverPortValue)
    this.webServer.start(serverPort)
  }
}

export default WebServerStarter
