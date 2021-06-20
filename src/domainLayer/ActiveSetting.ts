import {DataValidationFailure, ValueObjectCreationFailure} from './errors'

export class ActiveSetting {
  static validate(candidate: unknown): boolean {
    if (typeof candidate !== 'boolean') {
      const msg = 'value of active setting must be a boolean'
      throw new DataValidationFailure(msg)
    }
    return candidate
  }

  private constructor(private readonly _value: boolean) {}

  static create(candidate: unknown): ActiveSetting {
    try {
      const validValue = ActiveSetting.validate(candidate)
      return new ActiveSetting(validValue)
    } catch (error) {
      if (error instanceof DataValidationFailure) {
        throw new ValueObjectCreationFailure(error.message)
      }
      throw error
    }
  }

  get value(): boolean {
    return this._value
  }
}
