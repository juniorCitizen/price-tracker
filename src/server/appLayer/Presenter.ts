export interface Ok<PAYLOAD> {
  ok(payload?: PAYLOAD): void
}

export interface Created {
  created(message?: string): void
}

export interface NoContent {
  noContent(message?: string): void
}

export interface BadRequest {
  badRequest(message: string): void
}

export interface Unauthorized {
  unauthorized(message: string): void
}

export interface Forbidden {
  forbidden(message: string): void
}

export interface NotFound {
  notFound(message: string): void
}

export interface Conflict {
  conflict(message: string): void
}

export interface TooManyRequests {
  tooManyRequests(message: string): void
}

export interface InternalServerError {
  internalServerError(payload?: unknown): void
}

export interface NotImplemented {
  notImplemented(message: string): void
}

export interface ServiceUnavilable {
  serviceUnavailable(message: string): void
}

export interface Sending<PAYLOAD> {
  send(payload: PAYLOAD): Promise<void>
}

export interface Responding<PAYLOAD> {
  respond(payload?: PAYLOAD): void
}

export interface Reporting<EXCEPTION> {
  report(exception: EXCEPTION): void
}
