const validators = {}
const configurations = {
  debounceMs: 175,
  focusOnError: true,
  disableSubmitButtons: false,
  containerSelector: "[data-field-container]",
  errorMessageClass: "error-message",
  errorMessagePosition: "end",
  containerErrorClass: "container-error",
  fieldErrorClass: "field-error",
}

const locals = {}

const validationMap = {
  badInput: "invalid",
  patternMismatch: "pattern",
  rangeOverflow: "max",
  rangeUnderflow: "min",
  stepMismatch: "step",
  tooLong: "maxLength",
  tooShort: "minLength",
  typeMismatch: "typeMismatch",
  valueMissing: "required",
}

const config = (options = {}) => {
  Object.assign(configurations, options)
}

const addValidator = (name, func) => {
  validators[name] = func
}

const addLocal = (name, transalation) => {
  const result = {}
  Object.keys(validationMap).forEach((validationClass) => {
    const validationName = validationMap[validationClass]
    result[validationClass] = transalation[validationName]
  })

  locals[name] = result
}

export default class {
  constructor(dataMap) {
    this.locals = Object.assign({}, locals)
    this.validators = Object.assign({}, validators)
    this.configurations = Object.assign({}, configurations)

    Object.keys(this.configurations).forEach((key) => {
      if (dataMap.has(key)) {
        this.configurations[key] = dataMap.get(key)
      }
      this.configurations.debounceMs = parseInt(this.configurations.debounceMs)

      this.configurations.focusOnError =
        this.configurations.focusOnError === true ||
        this.configurations.focusOnError === "true"
    })
  }

  get currentLocal() {
    return this.locals["en"]
  }
}
export { addValidator, config, addLocal }
