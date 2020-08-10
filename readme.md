# Stimulus-form-validation - Experimental

### Add inline validation to your forms with ease.

- Use any HTML5 validation such as `required`
- Supports custom validations
- Auto disables/enable the submit button when the form's validity status changes.

## Install

yarn add stimulus-form-validation
npm install stimulus-form-validation

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
  <form action="">
    <!-- Add a selector to the field's container -->
    <!-- We will use the default selector, but it can be configured, see later. -->
    <div data-field-container>
      <label>Name</label>
      <input type="text" required />
    </div>
    <button>Submit</button>
  </form>
</div>
```

#### CSS

```css
.container-error {
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

First, define your validation function.
The function should return a Promise and reject with an error message if it fails validation.

```javascript
function userNameAvailable(element) {
  const { value } = element

  return new Promise(async (resolve, reject) => {
    const available = fetch(`usernameexamples.com/${value}`)

    available ? resolve() : reject("Username not available")
  })
}
```

Next, register the function:

```javascript
import { addValidation } from "stimulus-form-validation"

addValidation("userNameAvailable", userNameAvailable)
```

By default the validation function will timeout after 100ms, but you can overwrite it, like so:

```javascript
addValidation("userNameAvailable", userNameAvailable, 200)
```

Finaly add `data-validates="userNameAvailable"` to the input element

```HTML
<input type="text" data-validates="userNameAvailable" required/>
```

The `data-validates` takes a space delimited method list, so feel free to add more than one validator.

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
import { config } from "stimulus-form-validation"

config({
  containerSelector: "your-selector",
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
