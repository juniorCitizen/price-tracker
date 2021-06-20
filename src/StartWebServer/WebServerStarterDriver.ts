import Interactor, {WebServer} from './WebServerStarter'

export class WebServerStarterDriver {
  constructor(private webServer: WebServer) {}

  startWebServer(portValue?: string | number): void {
    const webServerStarter = new Interactor(this.webServer)
    webServerStarter.start(portValue)
  }
}

export default WebServerStarterDriver
