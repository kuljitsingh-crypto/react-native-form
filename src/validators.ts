const isNonEmptyString = (val: string) => {
  return typeof val === "string" && val.trim().length > 0;
};

// Form expects and undefined value for a successful validation
const VALID = undefined;

export const required = (message: string) => (value: any) => {
  if (typeof value === "undefined" || value === null) {
    // undefined or null values are invalid
    return message;
  }
  if (typeof value === "string") {
    // string must be nonempty when trimmed
    return isNonEmptyString(value) ? VALID : message;
  }
  return VALID;
};

export const minLength =
  (message: string, minimumLength: number) => (value: any) => {
    const hasLength = value && typeof value.length === "number";
    return hasLength && value.length >= minimumLength ? VALID : message;
  };

export const maxLength =
  (message: string, maximumLength: number) => (value: any) => {
    if (!value) {
      return VALID;
    }
    const hasLength = value && typeof value.length === "number";
    return hasLength && value.length <= maximumLength ? VALID : message;
  };

// Source: http://www.regular-expressions.info/email.html
// See the link above for an explanation of the tradeoffs.
const EMAIL_RE = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const emailFormatValid = (message: string) => (value: any) => {
  return value && EMAIL_RE.test(value) ? VALID : message;
};

export const composeValidators =
  (...validators: ((value: any) => string | undefined)[]) =>
  (value: any) =>
    validators.reduce(
      (error: string | undefined, validator) => error || validator(value),
      VALID
    );
