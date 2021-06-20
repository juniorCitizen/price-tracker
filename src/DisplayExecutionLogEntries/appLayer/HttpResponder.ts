import {BadRequest, Ok, Reporting, Unauthorized} from '../../appLayer/Presenter'
import {ExecutionLogEntry} from '../../domainLayer/ExecutionLogEntry'

export interface HttpResponder
  extends Ok<ExecutionLogEntry[]>,
    Unauthorized,
    BadRequest,
    Reporting<unknown> {}
