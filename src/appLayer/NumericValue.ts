import {NumberCreationError} from './errors'

export class NumericValue {
  private constructor(private readonly _value: number) {}

  static create(candidate: unknown): NumericValue {
    if (candidate === undefined || candidate === null) {
      const msg = 'value must not be undefined or null'
      throw new ReferenceError(msg)
    }
    if (typeof candidate !== 'number' && typeof candidate !== 'string') {
      const msg = 'value must either be a number or a string'
      throw new NumberCreationError(msg)
    }
    const numericCandidate = Number(candidate)
    if (Number.isNaN(numericCandidate)) {
      const msg =
        'value must be a valid number or must be resolvable to a valid number'
      throw new NumberCreationError(msg)
    }
    return new NumericValue(numericCandidate)
  }

  get value(): number {
    return this._value
  }
}
