export class StringCreationError extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = 'StringCreationError'
    Object.setPrototypeOf(this, StringCreationError.prototype)
  }
}

export class NumberCreationError extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = 'NumberCreationError'
    Object.setPrototypeOf(this, NumberCreationError.prototype)
  }
}

export class BooleanCreationError extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = 'BooleanCreationError'
    Object.setPrototypeOf(this, BooleanCreationError.prototype)
  }
}

export class InvalidRequestModel extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = 'InvalidRequestModel'
    Object.setPrototypeOf(this, InvalidRequestModel.prototype)
  }
}
