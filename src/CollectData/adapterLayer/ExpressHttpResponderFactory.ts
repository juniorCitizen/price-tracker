import {NextFunction, Request, Response} from 'express'
import {HttpResponder} from '../appLayer/HttpResponder'
import {HttpResponderFactory} from '../appLayer/HttpResponderFactory'
import {ExpressHttpResponder} from './ExpressHttpResponder'

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
