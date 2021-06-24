import Interactor, {WebServer} from './WebServerStarter'

export class WebServerStarterDriver {
  constructor(private webServer: WebServer) {}

  driveWebServerStarter(requestModel: string): void {
    const serverPort = Interactor.validateRequestModel(requestModel)
    const interactor = new Interactor(this.webServer)
    interactor.startWebServer(serverPort)
  }
}

export default WebServerStarterDriver
