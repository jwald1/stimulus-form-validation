export default class {
  constructor(config) {
    this.config = config
  }

  displayError(el, errorMessage) {
    this._insertErrorMessageElement(el)

    this.errorElement(el).textContent = errorMessage
    this.container(el).classList.add(this.config.containerErrorClass)
    el.classList.add(this.config.fieldErrorClass)
    el.dataset.errorDisplayed = true
  }

  reset(el) {
    this.container(el).classList.remove(this.config.containerErrorClass)
    el.classList.remove(this.config.fieldErrorClass)
    const errorElement = this.errorElement(el)

    errorElement && errorElement.remove()
  }

  displaySuccess(el) {
    this.reset(el)
  }

  // private

  _insertErrorMessageElement(el) {
    if (this.errorElement(el)) return

    this.container(el).insertAdjacentHTML(
      this.errorMessagePosition,
      `<div class="${this.config.errorMessageClass}"></div>`
    )
  }

  errorElement(el) {
    return this.container(el).querySelector("." + this.config.errorMessageClass)
  }

  container(el) {
    const _container = el.closest(this.config.containerSelector)

    if (!_container) {
      throw new Error(
        `We couldn't find the container for ${el} with selector ${this.config.containerErrorClass}`
      )
    }

    return _container
  }

  get errorMessagePosition() {
    switch (this.config.errorMessagePosition) {
      case "end":
        return "beforeend"
      case "start":
        return "afterbegin"

      default:
        return "beforeend"
    }
  }
}
