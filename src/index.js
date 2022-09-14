import "./i18n/en"
import View from "./view"
import Form from "./form"
import Element from "./element"
import { ValidationError } from "./validator"
import Config from "./config"
import { debounced } from "./utils"
import { Controller } from "@hotwired/stimulus"

class ValidationController extends Controller {
  connect = () => this._setup()
  disconnect = () => this._removeEventListeners()

  display({ target, errorMessage, previousMessage, visited }) {
    if (errorMessage === previousMessage && target.dataset.errorDisplayed) {
      return
    }

    if (errorMessage) {
      if (visited) {
        this._view.displayError(target, errorMessage)
      }
    } else {
      this._view.reset(target)
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
    this.form.noValidate = true

    this.config = new Config(this.data)
    this._form = new Form(this.form, this.config)
    this._view = new View(this._configurations)

    this.validate = debounced(this._validate, this._configurations.debounceMs)

    if (this._configurations.disableSubmitButtons) {
      this._setupMutiationObserver()

      if (!this.data.has("validated")) this._initialCheck()
    }

    this.form.addEventListener("submit", this._preventInvalidSubmission, true)
    this.form.addEventListener("input", this.validate, true)
    this.form.addEventListener("valueUpdated", this.validate, true)
    this.form.addEventListener("blur", this.recordVisit, true)
  }

  _removeEventListeners() {
    this.mutationObserver && this.mutationObserver.disconnect()
    this.form.removeEventListener(
      "submit",
      this._preventInvalidSubmission,
      true
    )
    this.form.removeEventListener("valueUpdated", this.validate, true)
    this.form.removeEventListener("input", this.validate, true)
    this.form.removeEventListener("blur", this.recordVisit, true)
  }

  _setupMutiationObserver() {
    this.mutationObserver = new MutationObserver((mutationList) => {
      const nodesNeedsValidation = this._nodesNeedsValidation(mutationList)

      if (!nodesNeedsValidation.length) return

      this._toggleSubmitButtons(this._form.isValid())

      nodesNeedsValidation.forEach((el) => {
        el.validate().catch(() => this._toggleSubmitButtons(false))
      })
    })

    this.mutationObserver.observe(this.form, {
      childList: true,
      subtree: true,
    })
  }

  _nodesNeedsValidation(mutationList) {
    const nodesNeedsValidation = []

    mutationList.forEach(({ addedNodes }) => {
      if (!addedNodes) return
      addedNodes.forEach((node) => {
        if (
          ["select", "input", "textarea"].includes(node.nodeName.toLowerCase())
        ) {
          const el = new Element(node, this.config)

          if (el.willValidate) {
            nodesNeedsValidation.push(el)
          }
        } else if (node.querySelector && node.querySelector("input, select")) {
          node.querySelectorAll("input, select", "textarea").forEach((node) => {
            const el = new Element(node, this.config)

            if (el.willValidate) {
              nodesNeedsValidation.push(el)
            }
          })
        }
      })
    })

    return nodesNeedsValidation
  }

  _preventInvalidSubmission = (event) => {
    if (this._configurations.disableSubmitButtons) {
      if (this._form.isValid()) return

      event.stopImmediatePropagation()
      event.stopPropagation()
      event.preventDefault()

      this._displayFormErrors()
    }
    const { submitter } = event
    if (submitter.hasAttribute("data-validation-submitter")) {
      submitter.remove()
      return
    }

    event.stopPropagation()
    event.stopImmediatePropagation()
    event.preventDefault()
    if (this.validationInProgress) return
    this.validationInProgress = true

    this._form
      .validate()
      .then(() => {
        this.validationInProgress = false
        this._submitWithCustomSubmitter(submitter)
      })
      .catch((error) => {
        if (error instanceof ValidationError) {
          this.validationInProgress = false
          this._displayFormErrors()
        } else {
          console.log(error)
          throw error
        }
      })
  }

  get form() {
    if (this.element.nodeName === "FORM") {
      return this.element
    } else {
      return this.element.querySelector("form")
    }
  }

  async _initialCheck() {
    this._form
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

      if (target.type === "radio") {
        await this._form.validate().catch(() => {})
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        errorMessage = error.message
      } else {
        throw error
      }
    }

    this._toggleSubmitButtons(this._form.isValid())

    this.display({ target, errorMessage, previousMessage, visited: el.visited })
  }

  _toggleSubmitButtons(bool) {
    if (!this._configurations.disableSubmitButtons) return

    this._form.submitButtons.forEach((submit) => {
      submit.disabled = !bool
    })
  }

  _focusFirstElement() {
    if (!this._configurations.focusOnError) {
      return
    }

    const element = this._form.elementsWithError[0]
    element && element.raw.focus()
  }

  get _configurations() {
    return this.config.configurations
  }

  _submitWithCustomSubmitter(originalSubmitter) {
    const input = document.createElement("template")
    input.innerHTML = `
      <input type="submit" 
      style="display: none;" 
      data-validation-submitter 
      name="${originalSubmitter.name}" 
      value="${originalSubmitter.value}" 
    />
    `
    this._form.raw.appendChild(input.content)

    setTimeout(() => {
      this._form.raw.querySelector("[data-validation-submitter]").click()
    })
  }

  _displayFormErrors() {
    this._form.elements.forEach((element) => {
      if (element.isInvalid()) {
        element.visited = true
        this.display({
          target: element.raw,
          errorMessage: element.cachedErrorMessage,
          visited: true,
        })
      }
    })

    this._focusFirstElement()
  }
}

import { addValidator, config } from "./config"

export { addValidator, config, ValidationController }
