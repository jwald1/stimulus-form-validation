const defaultMessages = {
  badInput: "is invalid",
  patternMismatch: "doesn't match %{pattern}",
  rangeOverflow: "must be less than %{max}",
  rangeUnderflow: "must be greater than %{min}",
  stepMismatch: "number is not divisible by %{step}",
  tooLong: "is too long (maximum is %{maxLength} characters)",
  tooShort: "is too short (minimum is %{minLength} characters)",
  typeMismatch: "is not a valid %{type}",
  valueMissing: "can't be blank",
}

const customMessageAttribute = {
  badInput: "is invalid",
  patternMismatch: "patternValidationMessage",
  rangeOverflow: "maxValidationMessage",
  rangeUnderflow: "minValidationMessage",
  stepMismatch: "stepValidationMessage",
  tooLong: "maxlengthValidationMessage",
  tooShort: "minlengthValidationMessage",
  typeMismatch: "typeValidationMessage",
  valueMissing: "requiredValidationMessage",
}

export default class {
  constructor(el, validationMethodGetter, useHtml5Messages) {
    this.el = el
    this.errorType = this.errorType()
    this.getCustomValidationMethod = validationMethodGetter
    this.useHtml5Messages = useHtml5Messages
  }

  message() {
    if (this.el.validity.valid && !this.customValidationMessage()) {
      return
    }

    return (
      this.customMessage() ||
      this.defaultMessage() ||
      this._customValidationMessage
    )
  }

  // private

  customMessage() {
    const dataAttribute = customMessageAttribute[this.errorType]

    return this.el.dataset[dataAttribute]
  }

  errorType() {
    const errorTypes = Object.keys(defaultMessages)
    for (let index = 0; index < errorTypes.length; index++) {
      if (this.el.validity[errorTypes[index]]) {
        return errorTypes[index]
      }
    }
  }

  customValidationMessage() {
    if (this._customValidationMessage) return this._customValidationMessage

    const customValidations = this.el.dataset.validates
    // scrub text
    if (!customValidations) return

    this._customValidationMessage = customValidations
      .split(/\s+/)
      .map((validationMethod) => {
        const method = this.getCustomValidationMethod(validationMethod)

        if (!method) {
          throw new Error(
            `Custom validation ${validationMethod} is not defined`
          )
        }

        return method(this.el)
      })
      .filter((message) => message)[0]

    return this._customValidationMessage
  }

  defaultMessage() {
    if (this.useHtml5Messages) {
      return this.el.validationMessage
    }
    const message = defaultMessages[this.errorType]

    return (
      message &&
      message.replace(/\%\{(.*)}/, (_, match) => {
        return this.el[match]
      })
    )
  }
}
