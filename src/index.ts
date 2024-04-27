export * from './form';
export * from './component/FieldCheckboxGroup';
export * from './component/FieldRadioGroup';

import {
  maxLength,
  minLength,
  required,
  composeValidators,
  emailFormatValid,
} from './validators';

export const validators = {
  maxLength,
  minLength,
  required,
  composeValidators,
  emailFormatValid,
};
