import {DataValidationFailure, ValueObjectCreationFailure} from './errors'

export class TradedAssetId {
  static readonly minLen = 2
  static readonly maxLen = 15

  static validate(candidate: unknown): string {
    if (typeof candidate !== 'string') {
      const msg = 'value traded asset id must be a string'
      throw new DataValidationFailure(msg)
    }
    if (
      candidate.length < TradedAssetId.minLen ||
      candidate.length > TradedAssetId.maxLen
    ) {
      const msg = `traded asset id must be ${TradedAssetId.minLen} to ${TradedAssetId.minLen} charaters long`
      throw new DataValidationFailure(msg)
    }
    return candidate
  }

  private constructor(private readonly _value: string) {}

  static create(candidate: unknown): TradedAssetId {
    try {
      const validValue = TradedAssetId.validate(candidate)
      return new TradedAssetId(validValue)
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
