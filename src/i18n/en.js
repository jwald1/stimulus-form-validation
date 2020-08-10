import { addLocal } from "../config"

const transalation = {
  invalid: "is invalid",
  pattern: "value doesn't match %{pattern}",
  max: "value must be less than %{max}",
  min: "value must be greater than %{min}",
  step: "number is not divisible by %{step}",
  maxLength: "too long (maximum is %{maxLength} characters)",
  minLength: "too short (minimum is %{minLength} characters)",
  typeMismatch: "not a valid %{type}",
  required: "can't be blank",
}

addLocal("en", transalation)
