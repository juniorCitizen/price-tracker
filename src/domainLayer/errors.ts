export class DataValidationFailure extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = 'DataValidationFailure'
    Object.setPrototypeOf(this, DataValidationFailure.prototype)
  }
}

export class EntityCreationFailure extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = 'EntityCreationFailure'
    Object.setPrototypeOf(this, EntityCreationFailure.prototype)
  }
}

export class ValueObjectCreationFailure extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = 'ValueObjectCreationFailure'
    Object.setPrototypeOf(this, ValueObjectCreationFailure.prototype)
  }
}

export class PropertyAccessFailure extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = 'PropertyAccessFailure'
    Object.setPrototypeOf(this, PropertyAccessFailure.prototype)
  }
}
