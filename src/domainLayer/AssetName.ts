import {ValueObjectCreationError} from './errors'

export class AssetName {
  static readonly minLen = 2
  static readonly maxLen = 32

  private constructor(private readonly _value: string) {}

  static create(candidate: string): AssetName {
    if (
      candidate.length < AssetName.minLen ||
      candidate.length > AssetName.maxLen
    ) {
      const range = `${AssetName.minLen} to ${AssetName.maxLen}`
      const msg = `traded asset name value must be ${range} charaters long`
      throw new ValueObjectCreationError(msg)
    }
    return new AssetName(candidate)
  }

  get value(): string {
    return this._value
  }
}
