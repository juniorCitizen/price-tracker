export class ActiveStatus {
  private constructor(private readonly _value: boolean) {}

  static create(candidate: boolean): ActiveStatus {
    return new ActiveStatus(candidate)
  }

  get value(): boolean {
    return this._value
  }
}
