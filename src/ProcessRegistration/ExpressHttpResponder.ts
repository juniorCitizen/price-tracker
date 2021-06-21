import AbstractExpressHttpResponder from '../adapterLayer/ExpressHttpResponder'
import {HttpResponder} from './HttpResponder'

export class ExpressHttpResponder
  extends AbstractExpressHttpResponder<string>
  implements HttpResponder
{
  ok(message?: string): void {
    message === undefined
      ? this.res.sendStatus(200)
      : this.res.status(200).send(message)
  }
}

export default ExpressHttpResponder
