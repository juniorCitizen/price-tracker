import {ValueObjectCreationError} from './errors'

export class Website {
  static readonly minLen = 2
  static readonly maxLen = 32

  private constructor(private readonly _value: string) {}

  static create(candidate: string): Website {
    if (
      candidate.length < Website.minLen ||
      candidate.length > Website.maxLen
    ) {
      const range = `${Website.minLen} to ${Website.maxLen}`
      const msg = `website value must be ${range} charaters long`
      throw new ValueObjectCreationError(msg)
    }
    return new Website(candidate)
  }

  get value(): string {
    return this._value
  }
}
