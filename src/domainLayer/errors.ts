export class DataValidationError extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = 'DataValidationError'
    Object.setPrototypeOf(this, DataValidationError.prototype)
  }
}

export class EntityCreationError extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = 'EntityCreationError'
    Object.setPrototypeOf(this, EntityCreationError.prototype)
  }
}

export class ValueObjectCreationError extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = 'ValueObjectCreationError'
    Object.setPrototypeOf(this, ValueObjectCreationError.prototype)
  }
}
