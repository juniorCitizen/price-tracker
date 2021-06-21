import AbstractExpressHttpResponder from '../adapterLayer/ExpressHttpResponder'
import {ExecutionLogEntry} from '../domainLayer/ExecutionLogEntry'
import {HttpResponder} from './HttpResponder'

export class ExpressHttpResponder
  extends AbstractExpressHttpResponder<ExecutionLogEntry[]>
  implements HttpResponder
{
  ok(logs: ExecutionLogEntry[]): void {
    this.res.status(200).render('logs', {logs: logs.map(l => l.value)})
  }
}

export default ExpressHttpResponder
