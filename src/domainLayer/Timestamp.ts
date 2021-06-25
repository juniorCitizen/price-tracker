import {ValueObjectCreationError} from './errors'

export class Timestamp {
  private constructor(private readonly _value: number) {}

  static create(candidate: number): Timestamp {
    if (Number.isNaN(candidate)) {
      const msg = 'timestamp value must be a valid number'
      throw new ValueObjectCreationError(msg)
    }
    if (!Number.isInteger(candidate)) {
      const msg = 'timestamp value must be an integer'
      throw new ValueObjectCreationError(msg)
    }
    if (candidate < 0) {
      const msg = `timestamp value must be zero or positive`
      throw new ValueObjectCreationError(msg)
    }
    return new Timestamp(candidate)
  }

  get value(): number {
    return this._value
  }
}
