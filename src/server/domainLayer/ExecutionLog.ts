import {ValidCurrencyCodeValue} from './CurrencyCode'
import {
  DataValidationError,
  EntityCreationError,
  ValueObjectCreationError,
} from './errors'
import {ExecutionResult} from './ExecutionResult'
import {LogMessage} from './LogMessage'
import {Subscriber} from './Subscriber'
import {SuccessStatus} from './SuccessStatus'
import {Timestamp} from './Timestamp'
import {TrackedAsset} from './TrackedAsset'

export class ExecutionLog {
  private constructor(
    private readonly _timestamp: Timestamp,
    private readonly _subscriber: Subscriber | undefined,
    private readonly _trackedAsset: TrackedAsset | undefined,
    private readonly _success: SuccessStatus,
    private readonly _message: LogMessage | undefined,
  ) {}

  static create(
    candidate:
      | {
          timestamp: number | Timestamp
          subscriber?:
            | {
                readonly name: string
                readonly email: string
              }
            | Subscriber
          trackedAsset?:
            | {
                readonly id: string
                readonly name: string
                readonly unit: string
                readonly currency: string
                readonly decimals: number
                readonly source: string
                readonly website: string
                readonly url: string
                readonly dateSelector: string
                readonly priceSelector: string
                readonly active: boolean
              }
            | TrackedAsset
          success: boolean | SuccessStatus
          message?: string | LogMessage
        }
      | ExecutionResult,
  ): ExecutionLog {
    try {
      if (candidate instanceof ExecutionResult) {
        return new ExecutionLog(
          Timestamp.create(Date.now()),
          candidate.subscriber,
          candidate.trackedAsset,
          candidate.success,
          candidate.message,
        )
      }
      const {timestamp, subscriber, trackedAsset, success, message} = candidate
      const _timestamp =
        timestamp instanceof Timestamp ? timestamp : Timestamp.create(timestamp)
      const _subscriber =
        subscriber instanceof Subscriber
          ? subscriber
          : subscriber === undefined
          ? undefined
          : Subscriber.create(subscriber)
      const _trackedAsset =
        trackedAsset instanceof TrackedAsset
          ? trackedAsset
          : trackedAsset === undefined
          ? undefined
          : TrackedAsset.create(trackedAsset)
      const _success =
        success instanceof SuccessStatus
          ? success
          : SuccessStatus.create(success)
      const _message =
        message instanceof LogMessage
          ? message
          : message === undefined
          ? undefined
          : LogMessage.create(message)
      return new ExecutionLog(
        _timestamp,
        _subscriber,
        _trackedAsset,
        _success,
        _message,
      )
    } catch (error) {
      if (
        error instanceof DataValidationError ||
        error instanceof ValueObjectCreationError
      ) {
        const reason = error.message
        const msg = `failed to create execution log (${reason})`
        throw new EntityCreationError(msg)
      }
      throw error
    }
  }

  get timestamp(): Timestamp {
    return this._timestamp
  }

  get subscriber(): Subscriber | undefined {
    return this._subscriber
  }

  get trackedAsset(): TrackedAsset | undefined {
    return this._trackedAsset
  }

  get success(): SuccessStatus {
    return this._success
  }

  get message(): LogMessage | undefined {
    return this._message
  }

  get value(): {
    readonly timestamp: number
    readonly subscriber?: {
      readonly name: string
      readonly email: string
    }
    readonly trackedAsset?: {
      readonly id: string
      readonly name: string
      readonly unit: string
      readonly currency: ValidCurrencyCodeValue
      readonly decimals: number
      readonly source: string
      readonly website: string
      readonly url: string
      readonly dateSelector: string
      readonly priceSelector: string
      readonly active: boolean
    }
    readonly success: boolean
    readonly message?: string
  } {
    const value: {
      timestamp: number
      subscriber?: {
        name: string
        email: string
      }
      trackedAsset?: {
        id: string
        name: string
        unit: string
        currency: ValidCurrencyCodeValue
        decimals: number
        source: string
        website: string
        url: string
        dateSelector: string
        priceSelector: string
        active: boolean
      }
      success: boolean
      message?: string
    } = {
      timestamp: this._timestamp.value,
      success: this._success.value,
    }
    if (this._subscriber !== undefined) {
      value.subscriber = Object.freeze(this._subscriber.value)
    }
    if (this._trackedAsset !== undefined) {
      value.trackedAsset = Object.freeze(this._trackedAsset.value)
    }
    if (this._message !== undefined) {
      value.message = this._message.value
    }
    return Object.freeze(value)
  }
}
