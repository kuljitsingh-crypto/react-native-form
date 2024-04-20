export * from "./form";
import {
  maxLength,
  minLength,
  required,
  composeValidators,
  emailFormatValid,
} from "./validators";

export const validators = {
  maxLength,
  minLength,
  required,
  composeValidators,
  emailFormatValid,
};
