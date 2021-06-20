import {
  BadRequest,
  Conflict,
  InternalServerError,
  Ok,
  Reporting,
} from '../../appLayer/Presenter'
import {Existence, Persistence} from '../../appLayer/SubscriberRepository'
import {DataValidationFailure} from '../../domainLayer/errors'
import {Subscriber} from '../../domainLayer/Subscriber'

export interface Repository extends Existence, Persistence {}

export interface Presenter
  extends Ok<string>,
    BadRequest,
    Conflict,
    InternalServerError,
    Reporting<unknown> {}

export interface PresenterFactory {
  make(): Presenter
}

export class RegistrationProcessor {
  constructor(private repository: Repository, private presenter: Presenter) {}

  processRegistration(requestModel: unknown): void {
    try {
      let subscriberInfo
      try {
        subscriberInfo = Subscriber.validate(requestModel)
      } catch (error) {
        if (error instanceof DataValidationFailure) {
          const msg = `invalid subscriber information (${error.message})`
          this.presenter.badRequest(msg)
          return
        }
        throw error
      }
      if (this.repository.exists(subscriberInfo)) {
        const msg = 'email has been registered by an existing subscriber'
        this.presenter.conflict(msg)
        return
      }
      this.repository.persist(subscriberInfo)
      this.presenter.ok('subscribed')
    } catch (error) {
      this.presenter.report(error)
    }
  }
}

export default RegistrationProcessor
