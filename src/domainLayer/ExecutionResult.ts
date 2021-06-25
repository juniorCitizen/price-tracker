import {ValidCurrencyCodeValue} from './CurrencyCode'
import {DataValidationError, ValueObjectCreationError} from './errors'
import {LogMessage} from './LogMessage'
import {Subscriber} from './Subscriber'
import {SuccessStatus} from './SuccessStatus'
import {TrackedAsset} from './TrackedAsset'

export class ExecutionResult {
  private constructor(
    private readonly _subscriber: Subscriber | undefined,
    private readonly _trackedAsset: TrackedAsset | undefined,
    private readonly _success: SuccessStatus,
    private readonly _message: LogMessage | undefined,
  ) {}

  static create(candidate: {
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
  }): ExecutionResult {
    try {
      const {subscriber, trackedAsset, success, message} = candidate
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
      return new ExecutionResult(_subscriber, _trackedAsset, _success, _message)
    } catch (error) {
      if (
        error instanceof DataValidationError ||
        error instanceof ValueObjectCreationError
      ) {
        const reason = error.message
        const msg = `failed to create execution result (${reason})`
        throw new ValueObjectCreationError(msg)
      }
      throw error
    }
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
