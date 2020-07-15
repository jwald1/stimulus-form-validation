# Stimulus-form-validation - Experimental

### Add inline validation to your forms with ease.

- Use any HTML5 validation such as `required`
- Supports custom validations
- Auto disables/enable the submit button when the form's validity status changes.

## Install

yarn add stimulus-form-validation
npm install stimulus-form-validation

## Basic usage

###

Add inline validation to your forms with ease.

Use any HTML5 validation such as `required`
Supports custom validations
Auto disables/enable the submit button when the form's validity status changes.

## Install

```
yarn add stimulus-form-validation
Or
npm install stimulus-form-validation
```

## Basic usage

### Register the controller

```javascript
import { Application } from "stimulus"
import FormValidationController from "stimulus-form-validation"

const application = Application.start()
application.register("validation", FormValidationController)
```

#### HTML

```html
<div data-controller="validation">
  <form action="" data-action="validation#validateAll">
    <!-- add a selector to the field's container -->
    <!-- Will use the default selector, but it can be configured, see later. -->
    <div data-field-container>
      <label>Name</label>

      <input
        type="text"
        data-action="
          input->validation#validate
          blur->validation#recordVisit"
        data-target="validation.field"
        required
      />
      <!-- We added blur->validation#recordVisit, because we only want to show an error to the user after visiting the field -->
    </div>
    <button>Submit</button>
    <!-- To disable the submit button when the form is invalid, just add data-target, like so: -->
    <button disabled data-target="validation.submit">
      Submit
      <!-- Please note, that the initial state has to be set manually -->
    </button>
  </form>
</div>
```

#### CSS

```css
[data-field-container] {
  /* your styles for the field container */
}

.field-error {
  /* your styles for the field */
}

.error-message {
  /* your styles for the error message */
}
```

## Custom validations

##### Most of the time HTML5 validations will suffice

Adding custom validations requires extending the controller.

The validation method will receive the element in question, and it should return an error message when it's invalid.

```javascript
import FormValidationController from "stimulus-form-validation"

export default class extends FormValidationController {
  passwordIsStrong(element) {
    if (element.value !== "strong") {
      return "Password is not strong enough"
    }
  }
}
```

Modify the field like so:

```HTML
<input
  type="password"
  data-action="
    input->validation#validate
    blur->validation#recordVisit"
  data-target="validation.field"
  data-validates="passwordIsStrong"
  required
/>
```

The `data-validation` takes a space delimited method list.

## Error messages

TODO

## Configruation

Default configruation

```javascript
{
  containerSelector: "[data-field-container]",
  errorMessageClass: "error-message",
  useHtml5Messages: false,
  errorMessagePosition: "end",
  containerErrorClass: "container-error",
  fieldErrorClass: "field-error",
  debounceMs: 150,
  focusOnError: "true",
}
```

| Option                 |                              Description                               |                            Data attribute |
| ---------------------- | :--------------------------------------------------------------------: | ----------------------------------------: |
| `containerSelector`    |       Used, by the controller, to located the field's container.       |      `data-identifier-container-selector` |
| `errorMessageClass`    |                      class for the error message                       |     `data-identifier-error-message-class` |
| `errorMessagePosition` | Where to place the error message. Accepted values are 'end' or 'start' |  `data-identifier-error-message-position` |
| `containerErrorClass`  |         Class added to the container if the field has an error         | `data-identifier-container-message-class` |
| `fieldErrorClass`      |           Class added to the field if the field has an error           |       `data-identifier-field-error-class` |
| `debounceMs`           |                      Validate debounce time in ms                      |             `data-identifier-debounce-ms` |
| `focusOnError`         |    Whether to focus the first field if there is an error on submit     |          `data-identifier-focus-on-error` |
| `useHtml5Messages`     |          If we should the browser's built in error messages.           |      `data-identifier-use-html5-messages` |

Can be overwritten via a data attribute or globaly like so:

```js
ValidationController.config({
  containerSelector: 'your-selector
})
```

## Advance

You can fully customize how an error message is displayed by overwriting the `display` method.
The `display` method receives two arguments, the element, and the error message.

```javascript
import FormValidationController from "stimulus-form-validation"

export default class extends FormValidationController {
  display(element, errorMessage) {
    alert(errorMessage)
  }
}
```

## Contributing

Bug reports and pull requests are welcome.

## License

This package is available as open source under the terms of the MIT License.
