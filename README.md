
# React Native Form

This is a React Native component library for creating forms with various input fields such as text input, number input, password input, checkbox, and radio button. It provides a convenient way to manage form state, validation, and submission. It also provides a set of utility functions for validating form input values in JavaScript or TypeScript.

## Installation

You can install this library using npm or yarn:

```
npm install react-native-form
```

or

```
yarn add react-native-form
```

## Usage

Import the necessary components from the library:

```jsx
import { ReactNativeForm, Field } from 'react-native-form';
```

Then, use the `ReactNativeForm` component to wrap your form elements, and the `Field` component to render individual input fields.

### Example: Basic Form

```jsx
import React from 'react';
import { ReactNativeForm, Field } from 'react-native-form';

const MyForm = () => {
  const handleSubmit = (values) => {
    console.log('Form submitted with values:', values);
  };

  return (
    <ReactNativeForm onSubmit={handleSubmit}>
      {({ onSubmit }) => (
        <>
          <Field
            name="name"
            type="text"
            label="Name"
            placeholder="Enter your name"
          />
          <Field
            name="email"
            type="text"
            label="Email"
            placeholder="Enter your email"
          />
          <Field
            name="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
          />
          <Button title="Submit" onPress={onSubmit} />
        </>
      )}
    </ReactNativeForm>
  );
};
```

### Example: Form with Different Field Types

```jsx
import React from 'react';
import { ReactNativeForm, Field } from 'react-native-form';

const MyForm = () => {
  const handleSubmit = (values) => {
    console.log('Form submitted with values:', values);
  };

  return (
    <ReactNativeForm onSubmit={handleSubmit}>
      {({ onSubmit }) => (
        <>
          <Field
            name="name"
            type="text"
            label="Name"
            placeholder="Enter your name"
          />
          <Field
            name="age"
            type="number"
            label="Age"
            placeholder="Enter your age"
          />
          <Field
            name="description"
            type="textBox"
            label="Description"
            placeholder="Enter your description"
          />
          <Field
            name="isSubscribed"
            type="checkbox"
            label="Subscribe to newsletter"
            value="subscribed"
          />
          <Field
            name="gender"
            type="radio"
            label="Male"
            value="male"
          />
          <Field
            name="gender"
            type="radio"
            label="Female"
            value="female"
          />
          <Button title="Submit" onPress={onSubmit} />
        </>
      )}
    </ReactNativeForm>
  );
};
```

## Props

### `ReactNativeForm`

| Prop           | Type                                     | Description                                                                     |
| -------------- | ---------------------------------------- | ------------------------------------------------------------------------------- |
| `initalValues` | `Record<string, unknown>`                | Initial values for the form fields                                             |
| `formStyle`    | `Record<string, unknown>`                | Style object to apply custom styles to the form container                      |
| `submitting`   | `boolean`                                | Flag to indicate if the form is currently being submitted                      |
| `onSubmit`     | `(value: Record<string, unknown>) => void` | Callback function called when the form is submitted                            |
| `onRender`     | `(args: RenderProps) => React.JSX.Element` | Render prop function to render the form elements and access form state/helpers |

### `Field`

| Prop                   | Type                                   | Description                                                  |
| ---------------------- | -------------------------------------- | ------------------------------------------------------------ |
| `name`                 | `string`                               | Name of the field                                            |
| `type`                 | `'text' \| 'textBox' \| 'number' \| 'password' \| 'checkbox' \| 'radio'` | Type of the input field   |
| `label`                | `string`                               | Label text for the input field                              |
| `placeholder`          | `string`                               | Placeholder text for the input field                        |
| `mainContainerStyle`   | `Record<string, unknown>`              | Style object to apply custom styles to the main container   |
| `contentContainerStyle`| `Record<string, unknown>`              | Style object to apply custom styles to the content container|
| `textStyle`            | `Record<string, unknown>`              | Style object to apply custom styles to the text input       |
| `labelStyle`           | `Record<string, unknown>`              | Style object to apply custom styles to the label            |
| `shouldUseScaleAnimation` | `boolean`                           | Flag to enable/disable scale animation for text input labels |
| `disabled`             | `boolean`                              | Flag to disable the input field                             |
| `formatValue`          | `<T>(value: T) => T`                   | Function to format the value of the input field             |
| `onChange`             | `(name: string, value: string \| undefined) => void` | Callback function called when the input value changes       |
| `onFocus`              | `(name: string) => void`               | Callback function called when the input field receives focus|
| `onBlur`               | `(name: string) => void`               | Callback function called when the input field loses focus   |
| `validate`             | `(value: string \| undefined) => string \| undefined` | Validation function for the input field      |


## Validation Utility Functions

### `required`

Checks if a value is provided. Returns an error message if the value is `undefined` or `null`, otherwise returns `undefined`.

Usage:

```typescript
const validator = required("This field is required");
const error = validator(value); // Returns an error message or undefined
```

### `minLength`

Checks if a string value meets a minimum length requirement. Returns an error message if the length is less than the specified minimum, otherwise returns `undefined`.

Usage:

```typescript
const validator = minLength("Must be at least 5 characters long", 5);
const error = validator(value); // Returns an error message or undefined
```

### `maxLength`

Checks if a string value meets a maximum length requirement. Returns an error message if the length exceeds the specified maximum, otherwise returns `undefined`.

Usage:

```typescript
const validator = maxLength("Must be at most 10 characters long", 10);
const error = validator(value); // Returns an error message or undefined
```

### `emailFormatValid`

Checks if a string value is a valid email address format using a regular expression. Returns an error message if the format is invalid, otherwise returns `undefined`.

Usage:

```typescript
const validator = emailFormatValid("Invalid email address");
const error = validator(value); // Returns an error message or undefined
```

### `composeValidators`

Composes multiple validators into a single validator function. It runs each validator in sequence until an error is encountered, returning the first error message, or `undefined` if all validators pass.

Usage:

```typescript
const validator = composeValidators(
  required("This field is required"),
  minLength("Must be at least 5 characters long", 5),
  maxLength("Must be at most 10 characters long", 10)
);
const error = validator(value); // Returns an error message or undefined
```


## Contributing

Contributions are welcome! If you find any issues or want to add new features, feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).