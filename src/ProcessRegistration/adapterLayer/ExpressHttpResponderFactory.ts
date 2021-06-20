import {NextFunction, Request, Response} from 'express'
import {ExpressHttpResponder} from './ExpressHttpResponder'
import {Presenter, PresenterFactory} from '../appLayer/RegistrationProcessor'

export class ExpressHttpResponderFactory implements PresenterFactory {
  constructor(
    private req: Request,
    private res: Response,
    private next: NextFunction,
  ) {}

  make(): Presenter {
    return new ExpressHttpResponder(this.req, this.res, this.next)
  }
}

export default ExpressHttpResponderFactory
