'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var debounce = _interopDefault(require('lodash.debounce'));
var stimulus = require('stimulus');

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

const defaultMessages = {
  badInput: "is invalid",
  patternMismatch: "doesn't match %{pattern}",
  rangeOverflow: "must be less than %{max}",
  rangeUnderflow: "must be greater than %{min}",
  stepMismatch: "number is not divisible by %{step}",
  tooLong: "is too long (maximum is %{maxLength} characters)",
  tooShort: "is too short (minimum is %{minLength} characters)",
  typeMismatch: "is not a valid %{type}",
  valueMissing: "can't be blank"
};
const customMessageAttribute = {
  badInput: "is invalid",
  patternMismatch: "patternValidationMessage",
  rangeOverflow: "maxValidationMessage",
  rangeUnderflow: "minValidationMessage",
  stepMismatch: "stepValidationMessage",
  tooLong: "maxlengthValidationMessage",
  tooShort: "minlengthValidationMessage",
  typeMismatch: "typeValidationMessage",
  valueMissing: "requiredValidationMessage"
};

let _default = /*#__PURE__*/function () {
  function _default(el, validationMethodGetter, useHtml5Messages) {
    _classCallCheck(this, _default);

    this.el = el;
    this.errorType = this.errorType();
    this.getCustomValidationMethod = validationMethodGetter;
    this.useHtml5Messages = useHtml5Messages;
  }

  _createClass(_default, [{
    key: "message",
    value: function message() {
      if (this.el.validity.valid && !this.customValidationMessage()) {
        return;
      }

      return this.customMessage() || this.defaultMessage() || this._customValidationMessage;
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
      const errorTypes = Object.keys(defaultMessages);

      for (let index = 0; index < errorTypes.length; index++) {
        if (this.el.validity[errorTypes[index]]) {
          return errorTypes[index];
        }
      }
    }
  }, {
    key: "customValidationMessage",
    value: function customValidationMessage() {
      if (this._customValidationMessage) return this._customValidationMessage;
      const customValidations = this.el.dataset.validates; // scrub text

      if (!customValidations) return;
      this._customValidationMessage = customValidations.split(/\s+/).map(validationMethod => {
        const method = this.getCustomValidationMethod(validationMethod);

        if (!method) {
          throw new Error(`Custom validation ${validationMethod} is not defined`);
        }

        return method(this.el);
      }).filter(message => message)[0];
      return this._customValidationMessage;
    }
  }, {
    key: "defaultMessage",
    value: function defaultMessage() {
      if (this.useHtml5Messages) {
        return this.el.validationMessage;
      }

      const message = defaultMessages[this.errorType];
      return message && message.replace(/\%\{(.*)}/, (_, match) => {
        return this.el[match];
      });
    }
  }]);

  return _default;
}();

let _default$1 = /*#__PURE__*/function () {
  function _default(el, errorMessage, config) {
    _classCallCheck(this, _default);

    this.el = el;
    this.errorMessage = errorMessage;
    this.config = config;
  }

  _createClass(_default, [{
    key: "render",
    value: function render() {
      if (!this.container) return;

      this._insertErrorMessageElement();

      if (this.errorMessage) {
        this.errorElement.textContent = this.errorMessage;
        this.container.classList.add(this.config.containerErrorClass);
        this.el.classList.add(this.config.fieldErrorClass);
      } else {
        this.container.classList.remove(this.config.containerErrorClass);
        this.el.classList.remove(this.config.fieldErrorClass);
        this.errorElement.textContent = "";
      }
    }
  }, {
    key: "_insertErrorMessageElement",
    value: function _insertErrorMessageElement() {
      if (!this.container.querySelector("." + this.config.errorMessageClass)) {
        this.container.insertAdjacentHTML(this.errorMessagePosition, `<div class="${this.config.errorMessageClass}"></div>`);
      }
    }
  }, {
    key: "errorElement",
    get: function () {
      return this.container.querySelector("." + this.config.errorMessageClass);
    }
  }, {
    key: "container",
    get: function () {
      return this.el.closest(this.config.containerSelector);
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

const _config = {
  containerSelector: "[data-field-container]",
  errorMessageClass: "error-message",
  useHtml5Messages: false,
  errorMessagePosition: "end",
  // start/end
  containerErrorClass: "container-error",
  // any css class
  fieldErrorClass: "field-error",
  // any css class
  debounceMs: 150,
  // integer
  focusOnError: true // true/false

};

let _default$2 = /*#__PURE__*/function (_Controller) {
  _inherits(_default$2, _Controller);

  var _super = _createSuper(_default$2);

  function _default$2(...args) {
    var _this;

    _classCallCheck(this, _default$2);

    _this = _super.call(this, ...args);

    _defineProperty(_assertThisInitialized(_this), "validateAll", event => {
      let formValid = true;

      _this.fieldTargets.forEach(field => {
        const error = _this._errorMessage(field);

        if (error) {
          formValid = false;

          _this.display(field, error);
        }
      });

      if (_this.hasSubmitTarget) {
        _this.submitTarget.disabled = !formValid;
      }

      if (!formValid) {
        event.preventDefault();

        _this._focusFirstInput();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "recordVisit", e => {
      e.target.dataset.visited = true;

      _this.validate(e);
    });

    return _this;
  }

  _createClass(_default$2, [{
    key: "mergeConfigOverwrites",
    value: function mergeConfigOverwrites() {
      const configKeys = Object.keys(_config);
      let result = {};
      const configClone = Object.assign({}, _config);
      configKeys.forEach(key => {
        if (this.data.has(key)) {
          result[key] = this.data.get(key);
        }
      });
      result = Object.assign(configClone, result);
      result.debounceMs = parseInt(result.debounceMs);
      result.focusOnError = result.focusOnError === true || result.focusOnError === "true";
      result.useHTML5Messages = result.useHtml5Messages === true || result.useHtml5Messages === "true";
      return result;
    }
  }, {
    key: "connect",
    value: function connect() {
      this.form.noValidate = true;
      this.config = this.mergeConfigOverwrites();
      this.validate = debounce(this.validate.bind(this), this.config.debouncedMs);
    }
  }, {
    key: "validate",
    value: function validate(event) {
      event.preventDefault();
      if (this._isVisitRequired(event.target)) return;
      this.display(event.target, this._errorMessage(event.target));

      if (this.hasSubmitTarget) {
        this.submitTarget.disabled = this._isFormInvalid();
      }
    }
  }, {
    key: "display",
    value: function display(element, errorMessage) {
      new _default$1(element, errorMessage, this.config).render();
    } // private

  }, {
    key: "_errorMessage",
    value: function _errorMessage(field) {
      return new _default(field, this.validationMethodGetter.bind(this), this.config.useHtml5Messages).message();
    }
  }, {
    key: "validationMethodGetter",
    value: function validationMethodGetter(methodName) {
      return this[methodName];
    }
  }, {
    key: "_isFieldValid",
    value: function _isFieldValid(field) {
      return !this._errorMessage(field);
    }
  }, {
    key: "_focusFirstInput",
    value: function _focusFirstInput(e) {
      if (this.data.get("focusOnError") === "false") {
        return;
      }

      const firstInputSelector = ["text", "email", "password", "search", "tel", "url"].map(type => `input[type="${type}"]:invalid`);
      this.form.querySelector(firstInputSelector.join(",")).focus();
    }
  }, {
    key: "_isFormInvalid",
    value: function _isFormInvalid() {
      return this.fieldTargets.some(field => !this._isFieldValid(field));
    }
  }, {
    key: "_isVisitRequired",
    value: function _isVisitRequired(field) {
      const recordVisitAction = `blur->${this.identifier}#recordVisit`;
      if (!field.dataset.action.includes(recordVisitAction)) return false; // It's a good practice, not to error until the user visits the field, but only for input fields

      if (field.nodeName !== "INPUT") return false;
      if (field.dataset.visited) return false;
      return ["text", "email", "password", "search", "tel", "url"].includes(field.type);
    }
  }, {
    key: "form",
    get: function () {
      if (this.element.nodeName === "FORM") {
        return this.element;
      } else {
        return this.element.querySelector("form");
      }
    }
  }], [{
    key: "config",
    value: function config(options = {}) {
      Object.assign(_config, options);
    }
  }]);

  return _default$2;
}(stimulus.Controller);

_defineProperty(_default$2, "targets", ["submit", "field"]);

module.exports = _default$2;
//# sourceMappingURL=index.js.map
