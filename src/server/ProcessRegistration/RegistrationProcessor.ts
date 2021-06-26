import {InvalidRequestModel, StringCreationError} from '../appLayer/errors'
import {
  BadRequest,
  Conflict,
  InternalServerError,
  Ok,
  Reporting,
} from '../appLayer/Presenter'
import {StringValue} from '../appLayer/StringValue'
import {Existence, Persistence} from '../appLayer/SubscriberRepository'
import {ValueObjectCreationError} from '../domainLayer/errors'
import {SubscriberInfo} from '../domainLayer/SubscriberInfo'

export interface HttpResponder
  extends Ok<string>,
    BadRequest,
    Conflict,
    InternalServerError,
    Reporting<unknown> {}

export interface SubscriberRepository extends Existence, Persistence {}

export class RegistrationProcessor {
  static validateRequestModel(candidate: unknown): SubscriberInfo {
    try {
      if (candidate === undefined || candidate === null) {
        const msg = 'subscriber info value must not be undefined or null'
        throw new ReferenceError(msg)
      }
      const {name, email} = candidate as {
        readonly name: unknown
        readonly email: unknown
      }
      return SubscriberInfo.create({
        name: StringValue.create(name).value,
        email: StringValue.create(email).value,
      })
    } catch (error) {
      if (
        error instanceof ReferenceError ||
        error instanceof StringCreationError ||
        error instanceof ValueObjectCreationError
      ) {
        const reason = error.message
        const msg = `invalid subscriber info (${reason})`
        throw new InvalidRequestModel(msg)
      }
      throw error
    }
  }

  constructor(
    private subscriberRepository: SubscriberRepository,
    private httpResponder: HttpResponder,
  ) {}

  processRegistration(subscriberInfo: SubscriberInfo): void {
    try {
      if (this.subscriberRepository.exists(subscriberInfo)) {
        const msg = 'email has been registered by an existing subscriber'
        this.httpResponder.conflict(msg)
        return
      }
      this.subscriberRepository.persist(subscriberInfo)
      this.httpResponder.ok('subscribed')
    } catch (error) {
      this.httpResponder.report(error)
    }
  }
}

export default RegistrationProcessor
