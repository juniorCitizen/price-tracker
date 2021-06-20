import {Express, RequestHandler} from 'express'
import {ExpressHttpResponderFactory} from './adapterLayer/ExpressHttpResponderFactory'
import Driver from './adapterLayer/RegistrationProcessorDriver'
import {Repository} from './appLayer/RegistrationProcessor'

export function enableRegistration(
  routePath: string,
  httpVerb: 'get' | 'post',
  dependencies: {
    app: Express
    repository: Repository
  },
): void {
  const requestHandler: RequestHandler = (req, res, next) => {
    const driver = new Driver(
      dependencies.repository,
      new ExpressHttpResponderFactory(req, res, next),
    )
    driver.processRegistration(req.body)
  }
  dependencies.app[httpVerb](routePath, requestHandler)
}

export default enableRegistration
