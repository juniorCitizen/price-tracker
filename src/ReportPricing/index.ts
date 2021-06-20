import {Express, RequestHandler} from 'express'
import {ExpressHttpResponderFactory} from './adapterLayer/ExpressHttpResponderFactory'
import {NodeMailerPriceDataEmailSenderFactory} from './adapterLayer/NodeMailerPriceDataEmailSenderFactory'
import PricingReporterDriver from './adapterLayer/PricingReporterDriver'
import {ParametersRepoistory} from './appLayer/ParametersRepository'
import {PriceRecordRepository} from './appLayer/PriceRecordRepsitory'
import {SubscriberRepository} from './appLayer/SubscriberRepository'

export function enableReporting(
  routePath: string,
  httpVerb: 'get' | 'post',
  dependencies: {
    connectionString: string | undefined
    emailSenderName: string | undefined
    emailSenderAddress: string | undefined
    app: Express
    parametersRepository: ParametersRepoistory
    priceRecordRepository: PriceRecordRepository
    subscriberRepository: SubscriberRepository
  },
): void {
  const requestHandler: RequestHandler = async (req, res, next) => {
    const httpResponderFactory = new ExpressHttpResponderFactory(req, res, next)
    if (dependencies.emailSenderName === undefined) {
      const reason = 'email sender name must be defined'
      const msg = `email reporting request handler registration failure (${reason})`
      throw new Error(msg)
    }
    if (dependencies.emailSenderAddress === undefined) {
      const reason = 'email sender address must be defined'
      const msg = `email reporting request handler registration failure (${reason})`
      throw new Error(msg)
    }
    const pricingReporterDriver = new PricingReporterDriver(
      dependencies.parametersRepository,
      dependencies.priceRecordRepository,
      dependencies.subscriberRepository,
      new NodeMailerPriceDataEmailSenderFactory(dependencies.connectionString, {
        name: dependencies.emailSenderName,
        address: dependencies.emailSenderAddress,
      }),
      httpResponderFactory,
    )
    await pricingReporterDriver.report(req.body)
  }
  dependencies.app[httpVerb](routePath, requestHandler)
}

export default enableReporting
