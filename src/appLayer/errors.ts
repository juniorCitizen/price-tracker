export class NoWorkableParameters extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = 'NoWorkableParameters'
    Object.setPrototypeOf(this, NoWorkableParameters.prototype)
  }
}

export class FailedToPresentData extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = 'FailedToPresentData'
    Object.setPrototypeOf(this, FailedToPresentData.prototype)
  }
}
