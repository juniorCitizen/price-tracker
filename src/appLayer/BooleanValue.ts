import {BooleanCreationError} from './errors'

export class BooleanValue {
  private constructor(private readonly _value: boolean) {}

  static create(candidate: unknown): BooleanValue {
    if (candidate === undefined || candidate === null) {
      const msg = 'value must not be undefined or null'
      throw new ReferenceError(msg)
    }
    if (typeof candidate !== 'boolean') {
      const msg = 'value must be boolean'
      throw new BooleanCreationError(msg)
    }
    return new BooleanValue(candidate)
  }

  get value(): boolean {
    return this._value
  }
}
