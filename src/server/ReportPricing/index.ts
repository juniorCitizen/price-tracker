import {Express, RequestHandler} from 'express'
import PriceRecordRepository from '../adapterLayer/PriceRecordGoogleSheetsRepository'
import SubscriberRepository from '../adapterLayer/SubscriberArrayRepository'
import TrackedAssetRepository from '../adapterLayer/TrackedAssetGoogleSheetsRepository'
import ExpressHttpResponderFactory from './ExpressHttpResponderFactory'
import PriceReportEmailSenderFactory from './NodemailerPricingReportEmailSenderFactory'
import Driver from './PricingReporterDriver'

export function enableReporting(
  routePath: string,
  httpVerb: 'get' | 'post',
  dependencies: {
    connectionString: string | undefined
    emailSenderName: string | undefined
    emailSenderAddress: string | undefined
    app: Express
    priceRecordRepository: PriceRecordRepository
    subscriberRepository: SubscriberRepository
    trackedAssetRepository: TrackedAssetRepository
  },
): void {
  const requestHandler: RequestHandler = async (req, res, next) => {
    const httpResponderFactory = new ExpressHttpResponderFactory(req, res, next)
    const httpResponder = httpResponderFactory.make()
    if (dependencies.emailSenderName === undefined) {
      const msg = 'email sender name must be defined'
      httpResponder.badRequest(msg)
      return
    }
    if (dependencies.emailSenderAddress === undefined) {
      const msg = 'email sender address must be defined'
      httpResponder.badRequest(msg)
      return
    }
    const sender = {
      name: dependencies.emailSenderName,
      address: dependencies.emailSenderAddress,
    }
    const driver = new Driver(
      dependencies.priceRecordRepository,
      dependencies.subscriberRepository,
      dependencies.trackedAssetRepository,
      new PriceReportEmailSenderFactory(dependencies.connectionString, sender),
      httpResponder,
    )
    await driver.report(req.body)
  }
  dependencies.app[httpVerb](routePath, requestHandler)
}

export default enableReporting
