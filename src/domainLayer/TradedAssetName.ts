import {DataValidationFailure, ValueObjectCreationFailure} from './errors'

export class TradedAssetName {
  static readonly minLen = 2
  static readonly maxLen = 32

  static validate(candidate: unknown): string {
    if (typeof candidate !== 'string') {
      const msg = 'value of traded asset name must be a string'
      throw new DataValidationFailure(msg)
    }
    if (
      candidate.length < TradedAssetName.minLen ||
      candidate.length > TradedAssetName.maxLen
    ) {
      const msg = `traded asset name must be ${TradedAssetName.minLen} to ${TradedAssetName.minLen} charaters long`
      throw new DataValidationFailure(msg)
    }
    return candidate
  }

  private constructor(private readonly _value: string) {}

  static create(candidate: unknown): TradedAssetName {
    try {
      const validValue = TradedAssetName.validate(candidate)
      return new TradedAssetName(validValue)
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
