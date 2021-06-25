import Interactor, {WebServer} from './WebServerStarter'

export class WebServerStarterDriver {
  constructor(private webServer: WebServer) {}

  driveWebServerStarter(port: number | string): void {
    const serverPort = Interactor.validateRequestModel(port)
    const interactor = new Interactor(this.webServer)
    interactor.startWebServer(serverPort)
  }
}

export default WebServerStarterDriver
