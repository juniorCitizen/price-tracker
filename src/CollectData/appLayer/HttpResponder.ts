import {
  BadRequest,
  Conflict,
  Forbidden,
  InternalServerError,
  NotFound,
  Ok,
  Reporting,
  Unauthorized,
} from '../../appLayer/Presenter'

export interface HttpResponder
  extends Ok<string>,
    InternalServerError,
    Unauthorized,
    NotFound,
    Forbidden,
    Conflict,
    BadRequest,
    Reporting<unknown> {}
