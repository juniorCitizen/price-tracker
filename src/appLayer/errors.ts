export class TypeAssertionFailure extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = 'TypeAssertionFailure'
    Object.setPrototypeOf(this, TypeAssertionFailure.prototype)
  }
}

export class StringValueCreationFailure extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = 'StringValueCreationFailure'
    Object.setPrototypeOf(this, StringValueCreationFailure.prototype)
  }
}

export class NumericValueCreationFailure extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = 'NumericValueCreationFailure'
    Object.setPrototypeOf(this, NumericValueCreationFailure.prototype)
  }
}

export class BooleanValueCreationFailure extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = 'BooleanValueCreationFailure'
    Object.setPrototypeOf(this, BooleanValueCreationFailure.prototype)
  }
}

export class InvalidRequestModel extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = 'InvalidRequestModel'
    Object.setPrototypeOf(this, InvalidRequestModel.prototype)
  }
}

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
