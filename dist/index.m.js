import { Controller } from 'stimulus';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

const validators = {};
const configurations = {
  debounceMs: 175,
  // integer
  focusOnError: true,
  // true/false
  disableSubmitButtons: true,
  containerSelector: "[data-field-container]",
  errorMessageClass: "error-message",
  errorMessagePosition: "end",
  // start/end
  containerErrorClass: "container-error",
  // any css class
  fieldErrorClass: "field-error" // any css class

};
const locals = {};
const validationMap = {
  badInput: "invalid",
  patternMismatch: "pattern",
  rangeOverflow: "max",
  rangeUnderflow: "min",
  stepMismatch: "step",
  tooLong: "maxLength",
  tooShort: "minLength",
  typeMismatch: "typeMismatch",
  valueMissing: "required"
};

const config = (options = {}) => {
  Object.assign(configurations, options);
};

const timeOutPromise = (promise, timeoutMs) => {
  const timeOutProm = new Promise((resolve, _) => {
    setTimeout(() => {
      resolve();
    }, timeoutMs);
  });
  return el => {
    return Promise.race([promise(el), timeOutProm]);
  };
};

const addValidator = (name, func, timeoutMS = 100) => {
  validators[name] = timeOutPromise(func, timeoutMS);
};

const addLocal = (name, transalation) => {
  const result = {};
  Object.keys(validationMap).forEach(validationClass => {
    const validationName = validationMap[validationClass];
    result[validationClass] = transalation[validationName];
  });
  locals[name] = result;
};

let _default = /*#__PURE__*/function () {
  function _default(dataMap) {
    _classCallCheck(this, _default);

    this.locals = Object.assign({}, locals);
    this.validators = Object.assign({}, validators);
    this.configurations = Object.assign({}, configurations); // extract data-attributes

    Object.keys(this.configurations).forEach(key => {
      if (dataMap.has(key)) {
        this.configurations[key] = dataMap.get(key);
      }

      this.configurations.debounceMs = parseInt(this.configurations.debounceMs);
      this.configurations.focusOnError = this.configurations.focusOnError === true || this.configurations.focusOnError === "true";
    });
  }

  _createClass(_default, [{
    key: "currentLocal",
    get: function () {
      return this.locals["en"];
    }
  }]);

  return _default;
}();

const transalation = {
  invalid: "is invalid",
  pattern: "value doesn't match %{pattern}",
  max: "value must be less than %{max}",
  min: "value must be greater than %{min}",
  step: "number is not divisible by %{step}",
  maxLength: "too long (maximum is %{maxLength} characters)",
  minLength: "too short (minimum is %{minLength} characters)",
  typeMismatch: "not a valid %{type}",
  required: "can't be blank"
};
addLocal("en", transalation);

let _default$1 = /*#__PURE__*/function () {
  function _default(config) {
    _classCallCheck(this, _default);

    this.config = config;
  }

  _createClass(_default, [{
    key: "displayError",
    value: function displayError(el, errorMessage) {
      this._insertErrorMessageElement(el);

      this.errorElement(el).textContent = errorMessage;
      this.container(el).classList.add(this.config.containerErrorClass);
      el.classList.add(this.config.fieldErrorClass);
      el.dataset.errorDisplayed = true;
    }
  }, {
    key: "reset",
    value: function reset(el) {
      this.container(el).classList.remove(this.config.containerErrorClass);
      el.classList.remove(this.config.fieldErrorClass);
      const errorElement = this.errorElement(el);
      errorElement && errorElement.remove();
    }
  }, {
    key: "displaySuccess",
    value: function displaySuccess(el) {
      this.reset(el);
    } // private

  }, {
    key: "_insertErrorMessageElement",
    value: function _insertErrorMessageElement(el) {
      if (this.errorElement(el)) return;
      this.container(el).insertAdjacentHTML(this.errorMessagePosition, `<div class="${this.config.errorMessageClass}"></div>`);
    }
  }, {
    key: "errorElement",
    value: function errorElement(el) {
      return this.container(el).querySelector("." + this.config.errorMessageClass);
    }
  }, {
    key: "container",
    value: function container(el) {
      const _container = el.closest(this.config.containerSelector);

      if (!_container) {
        throw new Error(`We couldn't find the container for ${el} with selector ${this.config.containerErrorClass}`);
      }

      return _container;
    }
  }, {
    key: "errorMessagePosition",
    get: function () {
      switch (this.config.errorMessagePosition) {
        case "end":
          return "beforeend";

        case "start":
          return "afterbegin";

        default:
          return "beforeend";
      }
    }
  }]);

  return _default;
}();

const customMessageAttribute = {
  badInput: "is invalid",
  patternMismatch: "patternMessage",
  rangeOverflow: "maxMessage",
  rangeUnderflow: "minMessage",
  stepMismatch: "stepMessage",
  tooLong: "maxLengthMessage",
  tooShort: "minLengthMessage",
  typeMismatch: "typeMessage",
  valueMissing: "requiredMessage"
};

let _default$2 = /*#__PURE__*/function () {
  function _default(el, config) {
    _classCallCheck(this, _default);

    this.el = el;
    this.errorType = this.errorType();
    this.config = config;
  }

  _createClass(_default, [{
    key: "message",
    value: function message() {
      return new Promise(async (resolve, reject) => {
        const fieldValid = this.el.validity.valid;

        if (!fieldValid) {
          return reject(this.customMessage() || this.defaultMessage());
        }

        try {
          resolve(await this.customValidationMessage());
        } catch (error) {
          reject(error);
        }
      });
    } // private

  }, {
    key: "customMessage",
    value: function customMessage() {
      const dataAttribute = customMessageAttribute[this.errorType];
      return this.el.dataset[dataAttribute];
    }
  }, {
    key: "errorType",
    value: function errorType() {
      const errorTypes = ["badInput", "patternMismatch", "rangeOverflow", "rangeUnderflow", "stepMismatch", "tooLong", "tooShort", "typeMismatch", "valueMissing"];

      for (let index = 0; index < errorTypes.length; index++) {
        if (this.el.validity[errorTypes[index]]) {
          return errorTypes[index];
        }
      }
    }
  }, {
    key: "customValidationMessage",
    value: function customValidationMessage() {
      const customValidations = this.el.dataset.validates; // scrub text

      if (!customValidations) return;
      return Promise.all(customValidations.split(/\s+/).map(validationMethod => {
        const method = this.config.validators[validationMethod];

        if (!method) {
          throw new Error(`Custom validation ${validationMethod} is not defined`);
        }

        return method(this.el);
      }));
    }
  }, {
    key: "defaultMessage",
    value: function defaultMessage() {
      const message = this.config.currentLocal[this.errorType];
      return message && message.replace(/\%\{(.*)}/, (_, match) => {
        return this.el[match];
      });
    }
  }]);

  return _default;
}();

const validInputTypes = ["checkbox", "color", "date", "datetime-local", "email", "file", "month", "number", "password", "radio", "range", "search", "tel", "text", "time", "url", "week"];

let _default$3 = /*#__PURE__*/function () {
  function _default(node, config) {
    _classCallCheck(this, _default);

    this.raw = node;
    this.config = config;
  }

  _createClass(_default, [{
    key: "isInvalid",
    value: function isInvalid() {
      return this.hasCacheErrorMessage();
    }
  }, {
    key: "isValid",
    value: function isValid() {
      return !this.isInvalid();
    }
  }, {
    key: "validate",
    value: function validate() {
      return new Promise(async (resolve, reject) => {
        try {
          await this._errorMessage();
          this.removeCachedErrorMessage();
          resolve();
        } catch (error) {
          if (typeof error === "string") {
            this.cacheErrorMessage(error);
            reject(error);
          } else {
            throw error;
          }
        }
      });
    }
  }, {
    key: "cacheErrorMessage",
    value: function cacheErrorMessage(message) {
      this.raw.dataset.validationMessageCache = message;
    }
  }, {
    key: "removeCachedErrorMessage",
    value: function removeCachedErrorMessage() {
      this.raw.removeAttribute("data-validation-message-cache");
    }
  }, {
    key: "hasCacheErrorMessage",
    value: function hasCacheErrorMessage() {
      return this.raw.hasAttribute("data-validation-message-cache");
    }
  }, {
    key: "_errorMessage",
    value: function _errorMessage() {
      return new _default$2(this.raw, this.config).message();
    }
  }, {
    key: "visited",
    set: function (bool) {
      this.raw.dataset.visited = bool;
    },
    get: function () {
      if (this.raw.dataset.visited) return true;
      const nodeName = this.raw.nodeName.toLowerCase();

      if (nodeName === "input") {
        return !["text", "email", "password", "search", "tel", "url"].includes(this.raw.type);
      } else if (nodeName === "textarea") {
        return false;
      } else {
        return true;
      }
    }
  }, {
    key: "willValidate",
    get: function () {
      if (this.raw.dataset.validationOn) return true;
      if (this.raw.dataset.validationOff) return false;
      const elementName = this.raw.nodeName.toLowerCase();
      const validatable = elementName === "input" && validInputTypes.includes(this.raw.type);

      if (validatable || ["select", "textarea"].includes(elementName)) {
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: "cachedErrorMessage",
    get: function () {
      return this.raw.dataset.validationMessageCache;
    }
  }]);

  return _default;
}();

let Form = /*#__PURE__*/function () {
  function Form(node, config) {
    _classCallCheck(this, Form);

    this.raw = node;
    this.config = config;
  }

  _createClass(Form, [{
    key: "isInvalid",
    value: function isInvalid() {
      return this.elements.some(el => el.isInvalid());
    }
  }, {
    key: "isValid",
    value: function isValid() {
      return !this.isInvalid();
    }
  }, {
    key: "validate",
    value: function validate() {
      let valid = true;
      return new Promise((resolve, reject) => {
        const elements = this.elements;
        if (!elements.length) resolve();
        elements.forEach(async (el, index) => {
          try {
            await el.validate();
          } catch (error) {
            if (typeof error === "string") {
              valid = false;
            } else {
              throw error;
            }
          }

          if (index + 1 === elements.length) {
            valid ? resolve() : reject();
          }
        });
      });
    } // private

  }, {
    key: "elements",
    get: function () {
      return this._allElements.map(el => new _default$3(el, this.config)).filter(el => el.willValidate);
    }
  }, {
    key: "submitButtons",
    get: function () {
      return this._allElements.filter(el => el.type === "submit");
    }
  }, {
    key: "elementsWithError",
    get: function () {
      return this.elements.filter(el => el.isInvalid());
    }
  }, {
    key: "_allElements",
    get: function () {
      return Array.from(this.raw.elements);
    }
  }]);

  return Form;
}();

const debounced = (fn, wait) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timeoutId = null;
      fn(...args);
    }, wait);
  };
};

let _default$4 = /*#__PURE__*/function (_Controller) {
  _inherits(_default$2, _Controller);

  var _super = _createSuper(_default$2);

  function _default$2(...args) {
    var _this;

    _classCallCheck(this, _default$2);

    _this = _super.call(this, ...args);

    _defineProperty(_assertThisInitialized(_this), "connect", () => _this._setup());

    _defineProperty(_assertThisInitialized(_this), "disconnect", () => _this._removeEventListeners());

    _defineProperty(_assertThisInitialized(_this), "preventInvalidSubmission", event => {
      if (_this.form.isValid()) return;
      event.stopImmediatePropagation();
      event.preventDefault();

      _this.form.elements.forEach(element => {
        if (element.isInvalid()) {
          element.visited = true;

          _this.display({
            target: element.raw,
            errorMessage: element.cachedErrorMessage
          });
        }
      });

      _this._focusFirstElement();
    });

    _defineProperty(_assertThisInitialized(_this), "recordVisit", e => {
      const el = new _default$3(e.target, _this.config);
      if (!el.willValidate) return;
      el.visited = true;

      _this._validate(e);
    });

    _defineProperty(_assertThisInitialized(_this), "_validate", async event => {
      event.preventDefault();
      let errorMessage;
      const {
        target
      } = event;
      const el = new _default$3(target, _this.config);
      const previousMessage = el.cachedErrorMessage;
      if (!el.willValidate) return;

      try {
        await el.validate();
      } catch (error) {
        if (typeof error === "string") {
          errorMessage = error;
        } else {
          throw error;
        }
      }

      _this._toggleSubmitButtons(_this.form.isValid());

      if (el.visited) {
        _this.display({
          target,
          errorMessage,
          previousMessage
        });
      }
    });

    return _this;
  }

  _createClass(_default$2, [{
    key: "display",
    value: function display({
      target,
      errorMessage,
      previousMessage
    }) {
      if (errorMessage === previousMessage && target.dataset.errorDisplayed) {
        return;
      }

      if (errorMessage) {
        this.view.displayError(target, errorMessage);
      } else {
        this.view.reset(target);
      }
    }
  }, {
    key: "_setup",
    // private
    value: function _setup() {
      this.rawForm.noValidate = true;
      this.config = new _default(this.data);
      this.form = new Form(this.rawForm, this.config);
      this.view = new _default$1(this.configurations);
      this.validate = debounced(this._validate, this.configurations.debounceMs);

      this._initialCheck();

      this.rawForm.addEventListener("submit", this.preventInvalidSubmission, true);
      this.rawForm.addEventListener("ajax:beforeSend", this.preventInvalidSubmission, true);
      this.rawForm.addEventListener("input", this.validate, true);
      this.rawForm.addEventListener("blur", this.recordVisit, true);
    }
  }, {
    key: "_removeEventListeners",
    value: function _removeEventListeners() {
      this.rawForm.removeEventListener("submit", this.preventInvalidSubmission, true);
      this.rawForm.removeEventListener("ajax:beforeSend", this.preventInvalidSubmission, true);
      this.rawForm.removeEventListener("input", this.validate, true);
      this.rawForm.removeEventListener("blur", this.recordVisit, true);
    }
  }, {
    key: "_initialCheck",
    value: async function _initialCheck() {
      this.form.validate().then(() => this._toggleSubmitButtons(true)).catch(() => this._toggleSubmitButtons(false));
    }
  }, {
    key: "_toggleSubmitButtons",
    value: function _toggleSubmitButtons(bool) {
      if (!this.configurations.disableSubmitButtons) return;
      this.form.submitButtons.forEach(submit => submit.disabled = !bool);
    }
  }, {
    key: "_focusFirstElement",
    value: function _focusFirstElement() {
      if (!this.configurations.focusOnError) {
        return;
      }

      this.form.elementsWithError[0].focus();
    }
  }, {
    key: "rawForm",
    get: function () {
      if (this.element.nodeName === "FORM") {
        return this.element;
      } else {
        return this.element.querySelector("form");
      }
    }
  }, {
    key: "configurations",
    get: function () {
      return this.config.configurations;
    }
  }]);

  return _default$2;
}(Controller);

export default _default$4;
export { addValidator, config };
//# sourceMappingURL=index.m.js.map
