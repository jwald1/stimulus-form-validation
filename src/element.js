import Validator from "./validator"
import { ValidationError } from "./validator"
const validInputTypes = [
  "checkbox",
  "color",
  "date",
  "datetime-local",
  "email",
  "file",
  "month",
  "number",
  "password",
  "radio",
  "range",
  "search",
  "tel",
  "text",
  "time",
  "url",
  "week",
]

export default class {
  constructor(node, config) {
    this.raw = node
    this.config = config
  }

  isInvalid() {
    return this.hasCacheErrorMessage()
  }

  isValid() {
    return !this.isInvalid()
  }

  validate() {
    return new Promise(async (resolve, reject) => {
      try {
        await this._errorMessage()
        this.removeCachedErrorMessage()

        resolve()
      } catch (error) {
        if (error instanceof ValidationError) {
          this.cacheErrorMessage(error.message)
          reject(error)
        } else {
          throw error
        }
      }
    })
  }

  set visited(bool) {
    this.raw.dataset.visited = bool
  }

  get visited() {
    if (this.raw.dataset.visited) return true
    const nodeName = this.raw.nodeName.toLowerCase()

    if (nodeName === "input") {
      return !["text", "email", "password", "search", "tel", "url"].includes(
        this.raw.type
      )
    } else if (nodeName === "textarea") {
      return false
    } else {
      return true
    }
  }

  get willValidate() {
    if (this.raw.dataset.validationOn) return true
    if (this.raw.dataset.validationOff) return false

    const elementName = this.raw.nodeName.toLowerCase()

    const validatable =
      elementName === "input" && validInputTypes.includes(this.raw.type)
    if (validatable || ["select", "textarea"].includes(elementName)) {
      return true
    } else {
      return false
    }
  }

  cacheErrorMessage(message) {
    this.raw.dataset.validationMessageCache = message
  }

  get cachedErrorMessage() {
    return this.raw.dataset.validationMessageCache
  }

  removeCachedErrorMessage() {
    this.raw.removeAttribute("data-validation-message-cache")
  }

  hasCacheErrorMessage() {
    return this.raw.hasAttribute("data-validation-message-cache")
  }

  _errorMessage() {
    return new Validator(this.raw, this.config).message()
  }
}
