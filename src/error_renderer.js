export default class {
  constructor(el, errorMessage, config) {
    this.el = el
    this.errorMessage = errorMessage
    this.config = config
  }

  render() {
    if (!this.container) return
    this._insertErrorMessageElement()

    if (this.errorMessage) {
      this.errorElement.textContent = this.errorMessage
      this.container.classList.add(this.config.containerErrorClass)
      this.el.classList.add(this.config.fieldErrorClass)
    } else {
      this.container.classList.remove(this.config.containerErrorClass)
      this.el.classList.remove(this.config.fieldErrorClass)
      this.errorElement.textContent = ""
    }
  }

  _insertErrorMessageElement() {
    if (!this.container.querySelector("." + this.config.errorMessageClass)) {
      this.container.insertAdjacentHTML(
        this.errorMessagePosition,
        `<div class="${this.config.errorMessageClass}"></div>`
      )
    }
  }

  get errorElement() {
    return this.container.querySelector("." + this.config.errorMessageClass)
  }

  get container() {
    return this.el.closest(this.config.containerSelector)
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
