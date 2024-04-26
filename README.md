
# Native Form

This is a React Native package that provides a simple and customizable form component with various field types such as text, textbox, number, password, checkbox, and radio buttons. It supports features like validation, error handling, and custom styling. It also provides a set of utility functions for validating form input values in JavaScript or TypeScript.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Form Options](#form-options)
- [Field Options](#field-options)
  - [Text Fields](#text-fields)
  - [Radio Fields](#radio-fields)
  - [Checkbox Fields](#checkbox-fields)
- [Validation Utility Functions](#validation-utility-functions)
- [Contributing](#contributing)
- [License](#license)

## Installation

You can install the package using npm or yarn:

```bash
npm install native-form
```

or

```bash
yarn add native-form
```

## Usage

Import the necessary components and use them in your React Native app:

```jsx
import { ReactNativeForm, Field } from 'native-form';

const MyForm = () => {
  const handleSubmit = (values) => {
    console.log('Form values:', values);
  };

  return (
    <ReactNativeForm onSubmit={handleSubmit} onRender={({ onSubmit }) => (
      <>
        <Field
          name="username"
          type="text"
          label="Username"
          placeholder="Enter your username"
        />
        <Field
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          enableTogglePasswordOption={true}
          togglePasswordType="classic"
          fillOnCheck={true}
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
        <Field
          name="interests"
          type="checkbox"
          label="Reading"
          value="reading"
        />
        <Field
          name="interests"
          type="checkbox"
          label="Coding"
          value="coding"
        />
        <Button onPress={onSubmit} title="Submit" />
      </>
    )} />
  );
};
```

In this example, we create a form with various field types, including text, password, radio buttons, and checkboxes. The `ReactNativeForm` component provides the form context and handles state management, while the `Field` component renders the individual fields based on the provided props.

When the form is submitted, the `handleSubmit` function will be called with the form values as an argument.

## Form Options

The `ReactNativeForm` component accepts the following props:

| Prop | Type | Description |
| --- | --- | --- |
| `initialValues` | `Record<string, unknown>` | Optional. The initial values for the form fields. |
| `formStyle` | `Record<string, unknown>` | Optional. Additional styles for the form container. |
| `submitting` | `boolean` | Optional. Whether the form is currently submitting. |
| `onSubmit` | `(value: Record<string, unknown>) => void` | Required. A callback function that is called when the form is submitted. |
| `onRender` | `(arg: { invalid: boolean, submitting: boolean, active: string \| undefined, values: Record<string, unknown>, initialValues: Record<string, unknown>, touched: Record<string, boolean>, errors: Record<string, unknown>, changeFormValues: (name: string, type: string, value: string \| undefined) => void, onSubmit: (event: GestureResponderEvent) => void }) => React.JSX.Element` | Required. A render prop that receives form state and helper functions as arguments and returns the form content. |

## Field Options

### Text Fields

| Prop | Type | Description |
| --- | --- | --- |
| `name` | `string` | Required. The unique identifier for the field. |
| `type` | `'text'`, `'textBox'`, `'number'`, `'password'` | Required. The type of the text field. |
| `label` | `string` | Optional. The label to be displayed for the field. |
| `placeholder` | `string` | Optional. The placeholder text for the field. |
| `mainContainerStyle` | `Record<string, unknown>` | Optional. Additional styles for the main container view. |
| `contentContainerStyle` | `Record<string, unknown>` | Optional. Additional styles for the content container view. |
| `textStyle` | `Record<string, unknown>` | Optional. Additional styles for the text input. |
| `labelStyle` | `Record<string, unknown>` | Optional. Additional styles for the label. |
| `shouldUseScaleAnimation` | `boolean` | Optional. Default: `true`. Whether to use a scale animation for the label when focused. |
| `disabled` | `boolean` | Optional. Default: `false`. Whether the field should be disabled. |
|`enableTogglePasswordOption` | `boolean` | Optional. Default `false`. A boolean indicating whether to show a toggle password option for password fields.|
|`togglePasswordType` | `string` | Optional. A string representing the type of toggle password option (`classic` or `modern`).|
| `fillOnCheck` | `boolean` | Optional. A boolean indicating whether to fill the checkbox on check. Applicable only when `togglePasswordType` = `classic`.
| `formatValue` | `<T>(value: T) => T` | Optional. A function to format the value before setting it. |
| `onChange` | `(name: string, value: string \| undefined) => void` | Optional. A callback function that is called when the value changes. |
| `onFocus` | `(name: string) => void` | Optional. A callback function that is called when the field gets focused. |
| `onBlur` | `(name: string) => void` | Optional. A callback function that is called when the field loses focus. |
| `validate` | `(value: string \| undefined) => string \| undefined` | Optional. A function to validate the field value and return an error message if invalid. |

### Radio Fields

| Prop | Type | Description |
| --- | --- | --- |
| `name` | `string` | Required. The unique identifier for the field. |
| `type` | `'radio'` | Required. The type of the field. |
| `label` | `string` | Required. The label to be displayed for the radio option. |
| `value` | `string` \| `number` | Required. The value of the radio option. |
| `required` | `boolean` | Optional. Whether the field is required. |
| `iconFillColor` | `string` | Optional. The color to be used for the radio icon. |
| `fillOnCheck` | `boolean` | Optional. Whether to fill the radio icon when checked. |
| `mainContainerStyle` | `Record<string, unknown>` | Optional. Additional styles for the main container view. |
| `contentContainerStyle` | `Record<string, unknown>` | Optional. Additional styles for the content container view. |
| `labelStyle` | `Record<string, unknown>` | Optional. Additional styles for the label. |
| `radioStyle` | `Record<string, unknown>` | Optional. Additional styles for the radio icon. |
| `onSelect` | `(name: string, value: string \| number) => void` | Optional. A callback function that is called when a radio option is selected. |
| `renderItem` | `(props: { isChecked: boolean, label: string, value: string \| number }) => JSX.Element` | Optional. A render prop to customize the rendering of the radio option. |

### Checkbox Fields

| Prop | Type | Description |
| --- | --- | --- |
| `name` | `string` | Required. The unique identifier for the field. |
| `type` | `'checkbox'` | Required. The type of the field. |
| `label` | `string` | Required. The label to be displayed for the checkbox option. |
| `value` | `string` \| `number` | Required. The value of the checkbox option. |
| `required` | `boolean` | Optional. Whether the field is required. |
| `fillOnCheck` | `boolean` | Optional. Whether to fill the checkbox icon when checked. |
| `iconFillColor` | `string` | Optional. The color to be used for the checkbox icon. |
| `mainContainerStyle` | `Record<string, unknown>` | Optional. Additional styles for the main container view. |
| `contentContainerStyle` | `Record<string, unknown>` | Optional. Additional styles for the content container view. |
| `labelStyle` | `Record<string, unknown>` | Optional. Additional styles for the label. |
| `checkboxStyle` | `Record<string, unknown>` | Optional. Additional styles for the checkbox icon. |
| `onSelect` | `(name: string, value: string \| number) => void` | Optional. A callback function that is called when a checkbox |
`renderItem` | `(props: { isChecked: boolean, label: string, value: string \| number }) => JSX.Element` | Optional. A render prop to customize the rendering of the checkbox option. |


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