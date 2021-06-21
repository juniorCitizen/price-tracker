import {
  BadRequest,
  Conflict,
  InternalServerError,
  Ok,
  Reporting,
} from '../appLayer/Presenter'

export interface HttpResponder
  extends Ok<string>,
    BadRequest,
    Conflict,
    InternalServerError,
    Reporting<unknown> {}
