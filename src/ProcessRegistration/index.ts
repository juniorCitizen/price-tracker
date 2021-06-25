import {Express, RequestHandler} from 'express'
import SubscriberArrayRepository from '../adapterLayer/SubscriberArrayRepository'
import ExpressHttpResponderFactory from './ExpressHttpResponderFactory'
import Driver from './RegistrationProcessorDriver'

export function enableRegistration(
  routePath: string,
  httpVerb: 'get' | 'post',
  dependencies: {
    app: Express
    subscriberRepository: SubscriberArrayRepository
  },
): void {
  const requestHandler: RequestHandler = (req, res, next) => {
    const driver = new Driver(
      dependencies.subscriberRepository,
      new ExpressHttpResponderFactory(req, res, next),
    )
    driver.driveRegistrationProcessor(req.body)
  }
  dependencies.app[httpVerb](routePath, requestHandler)
}

export default enableRegistration
