import {NextFunction, Request, Response} from 'express'
import ExpressHttpResponder from '../adapterLayer/ExpressHttpResponder'
import {HttpResponder} from './PricingReporter'
import {HttpResponderFactory} from './PricingReporterDriver'

export class ExpressHttpResponderFactory implements HttpResponderFactory {
  constructor(
    private req: Request,
    private res: Response,
    private next: NextFunction,
  ) {}

  make(): HttpResponder {
    return new ExpressHttpResponder(this.req, this.res, this.next)
  }
}

export default ExpressHttpResponderFactory
