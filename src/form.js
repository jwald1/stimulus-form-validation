import Element from "./element"
import { ValidationError } from "./validator"

export default class Form {
  constructor(node, config) {
    this.raw = node
    this.config = config
  }

  get elements() {
    return this._allElements
      .map((el) => new Element(el, this.config))
      .filter((el) => el.willValidate)
  }

  get submitButtons() {
    return this._allElements.filter((el) => el.type === "submit")
  }

  get elementsWithError() {
    return this.elements.filter((el) => el.isInvalid())
  }

  isInvalid() {
    return this.elements.some((el) => el.isInvalid())
  }

  isValid() {
    return !this.isInvalid()
  }

  markAllAsVisited() {
    this.elements.forEach((el) => (el.visited = true))
  }

  validate() {
    let valid = true
    return new Promise((resolve, reject) => {
      const elements = this.elements

      if (!elements.length) resolve()

      elements.forEach(async (el, index) => {
        try {
          await el.validate()
        } catch (error) {
          if (error instanceof ValidationError) {
            valid = false
          } else {
            throw error
          }
        }

        if (index + 1 === elements.length) {
          valid ? resolve() : reject(new ValidationError("form invalid"))
        }
      })
    })
  }

  // private

  get _allElements() {
    return Array.from(this.raw.elements)
  }
}
