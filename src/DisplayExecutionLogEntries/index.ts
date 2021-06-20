import {Express, RequestHandler} from 'express'
import {SubscriberRepository} from '../appLayer/SubscriberValidator'
import ExecutionLogEntryDisplayDriver from './adapterLayer/ExecutionLogEntryDisplayDriver'
import ExpressHttpResponderFactory from './adapterLayer/ExpressHttpResponderFactory'
import {ExecutionLogEntryRepository} from './appLayer/ExecutionLogEntryRepository'

export function enableLogDisplay(
  routePath: string,
  httpVerb: 'get' | 'post',
  dependencies: {
    app: Express
    executionLogEntryRepository: ExecutionLogEntryRepository
    subscriberRepository: SubscriberRepository
  },
): void {
  const requestHandler: RequestHandler = (req, res, next) => {
    const httpResponderFactory = new ExpressHttpResponderFactory(req, res, next)
    const executionLogEntryDisplayDriver = new ExecutionLogEntryDisplayDriver(
      dependencies.executionLogEntryRepository,
      dependencies.subscriberRepository,
      httpResponderFactory,
    )
    executionLogEntryDisplayDriver.display(req.query)
  }
  dependencies.app[httpVerb](routePath, requestHandler)
}

export default enableLogDisplay
