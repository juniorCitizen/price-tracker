import {ServerPort} from '../domainLayer/ServerPort'
import {WebServer} from './WebServer'

export class WebServerStarter {
  constructor(private webServer: WebServer) {}

  startWebServer(serverPortValue: string | number | undefined): void {
    const serverPort = ServerPort.create(serverPortValue)
    this.webServer.start(serverPort)
  }
}

export default WebServerStarter
