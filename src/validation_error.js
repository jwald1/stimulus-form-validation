const customMessageAttribute = {
  badInput: "is invalid",
  patternMismatch: "patternMessage",
  rangeOverflow: "maxMessage",
  rangeUnderflow: "minMessage",
  stepMismatch: "stepMessage",
  tooLong: "maxLengthMessage",
  tooShort: "minLengthMessage",
  typeMismatch: "typeMessage",
  valueMissing: "requiredMessage",
}

export default class {
  constructor(el, config) {
    this.el = el
    this.errorType = this.errorType()
    this.config = config
  }

  message() {
    return new Promise(async (resolve, reject) => {
      const fieldValid = this.el.validity.valid

      if (!fieldValid) {
        return reject(this.customMessage() || this.defaultMessage())
      }

      try {
        resolve(await this.customValidationMessage())
      } catch (error) {
        reject(error)
      }
    })
  }

  // private

  customMessage() {
    const dataAttribute = customMessageAttribute[this.errorType]

    return this.el.dataset[dataAttribute]
  }

  errorType() {
    const errorTypes = [
      "badInput",
      "patternMismatch",
      "rangeOverflow",
      "rangeUnderflow",
      "stepMismatch",
      "tooLong",
      "tooShort",
      "typeMismatch",
      "valueMissing",
    ]
    for (let index = 0; index < errorTypes.length; index++) {
      if (this.el.validity[errorTypes[index]]) {
        return errorTypes[index]
      }
    }
  }

  customValidationMessage() {
    const customValidations = this.el.dataset.validates
    // scrub text
    if (!customValidations) return

    return Promise.all(
      customValidations.split(/\s+/).map((validationMethod) => {
        const method = this.config.validators[validationMethod]

        if (!method) {
          throw new Error(
            `Custom validation ${validationMethod} is not defined`
          )
        }

        return method(this.el)
      })
    )
  }

  defaultMessage() {
    const message = this.config.currentLocal[this.errorType]

    return (
      message &&
      message.replace(/\%\{(.*)}/, (_, match) => {
        return this.el[match]
      })
    )
  }
}
