import ErrorMessage from "./error"
import ErrorRenderer from "./error_renderer"
import debounce from "lodash.debounce"

import { Controller } from "stimulus"

const config = {
  containerSelector: "[data-field-container]",
  errorMessageClass: "error-message",
  useHtml5Messages: false,
  errorMessagePosition: "end", // start/end
  containerErrorClass: "container-error", // any css class
  fieldErrorClass: "field-error", // any css class
  debounceMs: 150, // integer
  focusOnError: true, // true/false
}

export default class extends Controller {
  static targets = ["submit", "field"]

  static config(options = {}) {
    Object.assign(config, options)
  }

  mergeConfigOverwrites() {
    const configKeys = Object.keys(config)

    let result = {}
    const configClone = Object.assign({}, config)
    configKeys.forEach((key) => {
      if (this.data.has(key)) {
        result[key] = this.data.get(key)
      }
    })

    result = Object.assign(configClone, result)
    result.debounceMs = parseInt(result.debounceMs)
    result.focusOnError =
      result.focusOnError === true || result.focusOnError === "true"
    result.useHTML5Messages =
      result.useHtml5Messages === true || result.useHtml5Messages === "true"

    return result
  }

  connect() {
    this.form.noValidate = true
    this.config = this.mergeConfigOverwrites()
    this.validate = debounce(this.validate.bind(this), this.config.debouncedMs)
  }

  get form() {
    if (this.element.nodeName === "FORM") {
      return this.element
    } else {
      return this.element.querySelector("form")
    }
  }

  validateAll = (event) => {
    let formValid = true

    this.fieldTargets.forEach((field) => {
      const error = this._errorMessage(field)

      if (error) {
        formValid = false
        this.display(field, error)
      }
    })

    if (this.hasSubmitTarget) {
      this.submitTarget.disabled = !formValid
    }

    if (!formValid) {
      event.preventDefault()
      this._focusFirstInput()
    }
  }

  validate(event) {
    event.preventDefault()

    if (this._isVisitRequired(event.target)) return

    this.display(event.target, this._errorMessage(event.target))

    if (this.hasSubmitTarget) {
      this.submitTarget.disabled = this._isFormInvalid()
    }
  }

  recordVisit = (e) => {
    e.target.dataset.visited = true

    this.validate(e)
  }

  display(element, errorMessage) {
    new ErrorRenderer(element, errorMessage, this.config).render()
  }

  // private

  _errorMessage(field) {
    return new ErrorMessage(
      field,
      this.validationMethodGetter.bind(this),
      this.config.useHtml5Messages
    ).message()
  }

  validationMethodGetter(methodName) {
    return this[methodName]
  }

  _isFieldValid(field) {
    return !this._errorMessage(field)
  }

  _focusFirstInput(e) {
    if (this.data.get("focusOnError") === "false") {
      return
    }

    const firstInputSelector = [
      "text",
      "email",
      "password",
      "search",
      "tel",
      "url",
    ].map((type) => `input[type="${type}"]:invalid`)

    this.form.querySelector(firstInputSelector.join(",")).focus()
  }

  _isFormInvalid() {
    return this.fieldTargets.some((field) => !this._isFieldValid(field))
  }

  _isVisitRequired(field) {
    const recordVisitAction = `blur->${this.identifier}#recordVisit`

    if (!field.dataset.action.includes(recordVisitAction)) return false
    // It's a good practice, not to error until the user visits the field, but only for input fields
    if (field.nodeName !== "INPUT") return false
    if (field.dataset.visited) return false

    return ["text", "email", "password", "search", "tel", "url"].includes(
      field.type
    )
  }
}
