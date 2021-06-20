import {
  BadRequest,
  InternalServerError,
  NoContent,
  Ok,
  Reporting,
  Unauthorized,
} from '../../appLayer/Presenter'

export interface HttpResponder
  extends Ok<string>,
    BadRequest,
    Unauthorized,
    Reporting<unknown>,
    InternalServerError,
    NoContent {}
