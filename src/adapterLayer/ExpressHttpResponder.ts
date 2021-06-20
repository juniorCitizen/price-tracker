import {NextFunction, Request, Response} from 'express'
import {
  BadRequest,
  Conflict,
  Created,
  Forbidden,
  InternalServerError,
  NoContent,
  NotFound,
  NotImplemented,
  Ok,
  Reporting,
  ServiceUnavilable,
  TooManyRequests,
  Unauthorized,
} from '../appLayer/Presenter'

export abstract class ExpressHttpResponder<OK_PAYLOAD>
  implements
    Ok<OK_PAYLOAD>,
    Created,
    NoContent,
    BadRequest,
    Unauthorized,
    Forbidden,
    NotFound,
    Conflict,
    TooManyRequests,
    InternalServerError,
    NotImplemented,
    ServiceUnavilable,
    Reporting<unknown>
{
  constructor(
    protected req: Request,
    protected res: Response,
    protected next: NextFunction,
  ) {}

  abstract ok(payload?: OK_PAYLOAD): void

  created(message?: string): void {
    message === undefined
      ? this.res.status(201).send('201 created')
      : this.res.status(201).send(message)
  }

  noContent(message?: string): void {
    message === undefined
      ? this.res.status(204).send('204 no content')
      : this.res.status(204).send(message)
  }

  badRequest(message?: string): void {
    message === undefined
      ? this.res.status(400).send('400 bad request')
      : this.res.status(400).send(message)
  }

  unauthorized(message?: string): void {
    message === undefined
      ? this.res.status(401).send('401 unauthorized')
      : this.res.status(401).send(message)
  }

  forbidden(message?: string): void {
    message === undefined
      ? this.res.status(403).send('403 forbidden')
      : this.res.status(403).send(message)
  }

  notFound(message?: string): void {
    message === undefined
      ? this.res.status(404).send('404 not found')
      : this.res.status(404).send(message)
  }

  conflict(message?: string): void {
    message === undefined
      ? this.res.status(409).send('409 conflict')
      : this.res.status(409).send(message)
  }

  tooManyRequests(message?: string): void {
    message === undefined
      ? this.res.status(429).send('429 too many requests')
      : this.res.status(429).send(message)
  }

  internalServerError(message?: string): void {
    message === undefined
      ? this.res.status(500).send('500 internal server error')
      : this.res.status(500).send(message)
  }

  notImplemented(message?: string): void {
    message === undefined
      ? this.res.status(501).send('501 not implemented')
      : this.res.status(501).send(message)
  }

  serviceUnavailable(message?: string): void {
    message === undefined
      ? this.res.status(503).send('503 service unavailable')
      : this.res.status(503).send(message)
  }

  report(unknownError: unknown): void {
    this.next(unknownError)
  }
}

export default ExpressHttpResponder
