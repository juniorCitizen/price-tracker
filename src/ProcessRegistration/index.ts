import {Express, RequestHandler} from 'express'
import {ExpressHttpResponderFactory} from './ExpressHttpResponderFactory'
import RegistrationProcessorDriver from './RegistrationProcessorDriver'
import {SubscriberRepository} from './SubscriberRepository'

export function enableRegistration(
  routePath: string,
  httpVerb: 'get' | 'post',
  dependencies: {
    app: Express
    subscriberRepository: SubscriberRepository
  },
): void {
  const requestHandler: RequestHandler = (req, res, next) => {
    const registrationProcessorDriver = new RegistrationProcessorDriver(
      dependencies.subscriberRepository,
      new ExpressHttpResponderFactory(req, res, next),
    )
    registrationProcessorDriver.driveRegistrationProcessor(req.body)
  }
  dependencies.app[httpVerb](routePath, requestHandler)
}

export default enableRegistration
