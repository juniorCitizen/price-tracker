import {Express} from 'express'
import {ExpressWebServer} from '../adapterLayer/ExpressWebServer'
import Driver from './WebServerStarterDriver'

export function startWebServer(app: Express, port?: string | undefined): void {
  const webServer = new ExpressWebServer(app)
  const webServerStarterDriver = new Driver(webServer)
  webServerStarterDriver.startWebServer(port)
}

export default startWebServer
