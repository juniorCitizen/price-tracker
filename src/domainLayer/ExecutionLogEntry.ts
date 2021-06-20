import {DataValidationFailure, EntityCreationFailure} from './errors'
import {Parameters, ParametersDS} from './Parameters'

export interface ExecutionLogEntryDS {
  readonly timestamp?: number
  readonly parameters: ParametersDS
  readonly success: boolean
  readonly message?: string
}

export class ExecutionLogEntry {
  static validate(candidate: unknown): {
    timestamp: number
    parameters: ParametersDS
    success: boolean
    message?: string
  } {
    if (candidate === undefined || candidate === null) {
      const msg = 'execution log entry cannot be undefined or null'
      throw new DataValidationFailure(msg)
    }
    const {
      timestamp: _timestamp,
      parameters: _parameters,
      success,
      message,
    } = candidate as Record<string, unknown>
    let timestamp: number
    if (_timestamp === undefined) {
      timestamp = Date.now()
    } else {
      if (
        typeof _timestamp !== 'number' ||
        Number.isNaN(_timestamp) ||
        !Number.isInteger(_timestamp)
      ) {
        const msg = 'value of timestamp must be an integer if explictly defined'
        throw new DataValidationFailure(msg)
      }
      if (_timestamp <= 0) {
        const msg = 'timestamp must be a positive integer'
        throw new DataValidationFailure(msg)
      }
      timestamp = _timestamp
    }
    const parameters = Parameters.validate(_parameters)
    if (typeof success !== 'boolean') {
      const msg = 'value of success must be a boolean'
      throw new DataValidationFailure(msg)
    }
    if (message !== undefined) {
      if (typeof message !== 'string') {
        const msg = 'value of message must be a string if explicitly defined'
        throw new DataValidationFailure(msg)
      }
      return {timestamp, parameters, success, message}
    } else {
      return {timestamp, parameters, success}
    }
  }

  private constructor(
    private readonly _timestamp: number,
    private readonly _parameters: ParametersDS,
    private readonly _success: boolean,
    private readonly _message?: string,
  ) {}

  static create(candidate: unknown): ExecutionLogEntry {
    try {
      const {timestamp, parameters, success, message} =
        ExecutionLogEntry.validate(candidate)
      return message === undefined
        ? new ExecutionLogEntry(timestamp, parameters, success)
        : new ExecutionLogEntry(timestamp, parameters, success, message)
    } catch (error) {
      if (error instanceof DataValidationFailure) {
        throw new EntityCreationFailure(error.message)
      }
      throw error
    }
  }

  get value(): {
    readonly timestamp: number
    readonly parameters: ParametersDS
    readonly success: boolean
    readonly message?: string
  } {
    return this._message === undefined
      ? {
          timestamp: this._timestamp,
          parameters: this._parameters,
          success: this._success,
        }
      : {
          timestamp: this._timestamp,
          parameters: this._parameters,
          success: this._success,
          message: this._message,
        }
  }
}
