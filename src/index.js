import "./i18n/en"
import View from "./view"
import Form from "./form"
import Element from "./element"
import Config from "./config"
import { debounced } from "./utils"
import { Controller } from "stimulus"

export default class extends Controller {
  connect = () => this._setup()
  disconnect = () => this._removeEventListeners()

  preventInvalidSubmission = (event) => {
    if (this.form.isValid()) return

    event.stopImmediatePropagation()
    event.preventDefault()

    this.form.elements.forEach((element) => {
      if (element.isInvalid()) {
        element.visited = true
        this.display({
          target: element.raw,
          errorMessage: element.cachedErrorMessage,
        })
      }
    })

    this._focusFirstElement()
  }

  display({ target, errorMessage, previousMessage }) {
    if (errorMessage === previousMessage && target.dataset.errorDisplayed) {
      return
    }

    if (errorMessage) {
      this.view.displayError(target, errorMessage)
    } else {
      this.view.reset(target)
    }
  }

  recordVisit = (e) => {
    const el = new Element(e.target, this.config)

    if (!el.willValidate) return
    el.visited = true

    this._validate(e)
  }

  // private

  _setup() {
    this.rawForm.noValidate = true

    this.config = new Config(this.data)
    this.form = new Form(this.rawForm, this.config)
    this.view = new View(this.configurations)

    this.validate = debounced(this._validate, this.configurations.debounceMs)

    this._initialCheck()

    this.rawForm.addEventListener("submit", this.preventInvalidSubmission, true)
    this.rawForm.addEventListener(
      "ajax:beforeSend",
      this.preventInvalidSubmission,
      true
    )
    this.rawForm.addEventListener("input", this.validate, true)
    this.rawForm.addEventListener("blur", this.recordVisit, true)
  }

  _removeEventListeners() {
    this.rawForm.removeEventListener(
      "submit",
      this.preventInvalidSubmission,
      true
    )
    this.rawForm.removeEventListener(
      "ajax:beforeSend",
      this.preventInvalidSubmission,
      true
    )
    this.rawForm.removeEventListener("input", this.validate, true)
    this.rawForm.removeEventListener("blur", this.recordVisit, true)
  }

  get rawForm() {
    if (this.element.nodeName === "FORM") {
      return this.element
    } else {
      return this.element.querySelector("form")
    }
  }

  async _initialCheck() {
    this.form
      .validate()
      .then(() => this._toggleSubmitButtons(true))
      .catch(() => this._toggleSubmitButtons(false))
  }

  _validate = async (event) => {
    event.preventDefault()

    let errorMessage
    const { target } = event
    const el = new Element(target, this.config)
    const previousMessage = el.cachedErrorMessage

    if (!el.willValidate) return

    try {
      await el.validate()
    } catch (error) {
      if (typeof error === "string") {
        errorMessage = error
      } else {
        throw error
      }
    }

    this._toggleSubmitButtons(this.form.isValid())

    if (el.visited) {
      this.display({ target, errorMessage, previousMessage })
    }
  }

  _toggleSubmitButtons(bool) {
    if (!this.configurations.disableSubmitButtons) return

    this.form.submitButtons.forEach((submit) => (submit.disabled = !bool))
  }

  _focusFirstElement() {
    if (!this.configurations.focusOnError) {
      return
    }

    this.form.elementsWithError[0].focus()
  }

  get configurations() {
    return this.config.configurations
  }
}

import { addValidator, config } from "./config"

export { addValidator, config }
