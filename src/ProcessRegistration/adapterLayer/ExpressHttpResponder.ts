import AbstractExpressHttpResponder from '../../adapterLayer/ExpressHttpResponder'
import {Presenter} from '../appLayer/RegistrationProcessor'

export class ExpressHttpResponder
  extends AbstractExpressHttpResponder<string>
  implements Presenter
{
  ok(message?: string): void {
    message === undefined
      ? this.res.sendStatus(200)
      : this.res.status(200).send(message)
  }
}

export default ExpressHttpResponder
