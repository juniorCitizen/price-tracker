import {ValueObjectCreationError} from './errors'

export class AssetUnit {
  static readonly minLen = 2
  static readonly maxLen = 8

  private constructor(private readonly _value: string) {}

  static create(candidate: string): AssetUnit {
    if (
      candidate.length < AssetUnit.minLen ||
      candidate.length > AssetUnit.maxLen
    ) {
      const range = `${AssetUnit.minLen} to ${AssetUnit.maxLen}`
      const msg = `traded asset unit value must be ${range} charaters long`
      throw new ValueObjectCreationError(msg)
    }
    return new AssetUnit(candidate)
  }

  get value(): string {
    return this._value
  }
}
