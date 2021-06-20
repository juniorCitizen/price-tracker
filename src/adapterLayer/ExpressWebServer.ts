import {Express, NextFunction, Request, Response} from 'express'
import {Starter} from '../appLayer/WebServer'
import {ServerPort} from '../domainLayer/ServerPort'

export class ExpressWebServer implements Starter {
  constructor(private app: Express) {}

  start(port: ServerPort): void {
    this.app.use(this.catchAll.bind(this))
    this.app.use(this.errorHandler.bind(this))
    this.app.listen(port.value, () => {
      console.log(`server listening on port: ${port.value}`)
    })
  }

  private catchAll(
    _req: Request,
    res: Response,
    _next: NextFunction, // eslint-disable-line
  ): void {
    res.status(404).send('404 page not found')
  }

  private errorHandler(
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction, // eslint-disable-line
  ): void {
    console.error(error)
    res.status(500).send('500 internal server error')
  }
}

export default ExpressWebServer
