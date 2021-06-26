import {Express} from 'express'
import WebServer from '../adapterLayer/ExpressWebServer'
import Driver from './WebServerStarterDriver'

export function startWebServer(app: Express, port: number | string): void {
  const webServer = new WebServer(app)
  const driver = new Driver(webServer)
  driver.driveWebServerStarter(port)
}

export default startWebServer
