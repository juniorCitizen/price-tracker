import {WebServer} from './WebServer'
import Interactor from './WebServerStarter'

export class WebServerStarterDriver {
  constructor(private webServer: WebServer) {}

  driveWebServerStarter(portValue?: string | number): void {
    const webServerStarter = new Interactor(this.webServer)
    webServerStarter.startWebServer(portValue)
  }
}

export default WebServerStarterDriver
