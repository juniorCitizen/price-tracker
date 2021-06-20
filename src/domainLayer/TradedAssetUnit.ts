import {DataValidationFailure, ValueObjectCreationFailure} from './errors'

export class TradedAssetUnit {
  static readonly minLen = 2
  static readonly maxLen = 8

  static validate(candidate: unknown): string {
    if (typeof candidate !== 'string') {
      const msg = 'value of traded asset unit must be a string'
      throw new DataValidationFailure(msg)
    }
    if (
      candidate.length < TradedAssetUnit.minLen ||
      candidate.length > TradedAssetUnit.maxLen
    ) {
      const msg = `traded asset unit must be ${TradedAssetUnit.minLen} to ${TradedAssetUnit.minLen} charaters long`
      throw new DataValidationFailure(msg)
    }
    return candidate
  }

  private constructor(private readonly _value: string) {}

  static create(candidate: unknown): TradedAssetUnit {
    try {
      const validValue = TradedAssetUnit.validate(candidate)
      return new TradedAssetUnit(validValue)
    } catch (error) {
      if (error instanceof DataValidationFailure) {
        throw new ValueObjectCreationFailure(error.message)
      }
      throw error
    }
  }

  get value(): string {
    return this._value
  }
}
