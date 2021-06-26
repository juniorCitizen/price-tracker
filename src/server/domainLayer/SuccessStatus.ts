export class SuccessStatus {
  private constructor(private readonly _value: boolean) {}

  static create(candidate: boolean): SuccessStatus {
    return new SuccessStatus(candidate)
  }

  get value(): boolean {
    return this._value
  }
}
