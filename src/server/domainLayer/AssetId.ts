import {ValueObjectCreationError} from './errors'

export class AssetId {
  static readonly minLen = 2
  static readonly maxLen = 15

  private constructor(private readonly _value: string) {}

  static create(candidate: string): AssetId {
    if (
      candidate.length < AssetId.minLen ||
      candidate.length > AssetId.maxLen
    ) {
      const range = `${AssetId.minLen} to ${AssetId.maxLen}`
      const msg = `traded asset id value must be ${range} charaters long`
      throw new ValueObjectCreationError(msg)
    }
    return new AssetId(candidate)
  }

  get value(): string {
    return this._value
  }
}
