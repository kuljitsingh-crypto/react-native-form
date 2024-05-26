import { TextInputProps } from "react-native";

export const textFieldTypes = {
  text: "text",
  textBox: "textBox",
  number: "number",
  password: "password",
  email: "email",
} as const;

export const fieldTypes = {
  ...textFieldTypes,
  checkbox: "checkbox",
  radio: "radio",
  singleSelect: "singleSelect",
  multiSelect: "multiSelect",
} as const;

export type TextFieldProps = Omit<
  TextInputProps,
  | "label"
  | "placeholder"
  | "disabled"
  | "placeholder"
  | "onChange"
  | "onFocus"
  | "onBlur"
> & {
  name: string;
  type: (typeof textFieldTypes)[keyof typeof textFieldTypes];
  label?: string;
  placeholder?: string;
  mainContainerStyle?: Record<string, unknown>;
  contentContainerStyle?: Record<string, unknown>;
  textStyle?: Record<string, unknown>;
  labelStyle?: Record<string, unknown>;
  shouldUseScaleAnimation?: boolean;
  disabled?: boolean;
  enableTogglePasswordOption?: boolean;
  togglePasswordType?: "classic" | "modern";
  fillOnCheck?: boolean;
  formatValue?: <T>(value: T) => T;
  onChange?: (name: string, value: string | number | undefined) => void;
  onFocus?: (name: string) => void;
  onBlur?: (name: string) => void;
  validate?: (value: string | number | undefined) => string | undefined;
};

export type CheckboxFieldProps = {
  name: string;
  type: "checkbox";
  label: string;
  value: string | number;
  required?: boolean;
  fillOnCheck?: boolean;
  iconFillColor?: string;
  mainContainerStyle?: Record<string, unknown>;
  contentContainerStyle?: Record<string, unknown>;
  labelStyle?: Record<string, unknown>;
  checkboxStyle?: Record<string, unknown>;
  renderItem?: (props: {
    isChecked: boolean;
    label: string;
    value: string | number;
  }) => React.JSX.Element;
  onSelect?: (name: string, value: string | number) => void;
};

export type RadioFieldProps = {
  name: string;
  type: "radio";
  label: string;
  value: string | number;
  required?: boolean;
  iconFillColor?: string;
  fillOnCheck?: boolean;
  mainContainerStyle?: Record<string, unknown>;
  contentContainerStyle?: Record<string, unknown>;
  labelStyle?: Record<string, unknown>;
  radioStyle?: Record<string, unknown>;
  onSelect?: (name: string, value: string | number) => void;
  renderItem?: (props: {
    isChecked: boolean;
    label: string;
    value: string | number;
  }) => React.JSX.Element;
};

export type FieldCheckboxGroupProps = {
  renderChildrenAs?: "column" | "row";
  options: { value: string | number; label: string }[];
} & Omit<CheckboxFieldProps, "value" | "label" | "type">;

export type FieldRadioGroupProps = {
  renderChildrenAs?: "column" | "row";
  options: { value: string | number; label: string }[];
} & Omit<RadioFieldProps, "value" | "label" | "type">;

export type FieldSelectProps = {
  name: string;
  options: { value: string | number; label: string }[];
  placeholder?: string;
  required?: boolean;
  label?: string;
  multiple?: boolean;
  closeOnSelect?: boolean;
  confirmButtonText?: string;
  confirmButtonStyle?: Record<string, unknown>;
  confirmButtonTextStyle?: Record<string, unknown>;
  mainContainerStyle?: Record<string, unknown>;
  itemsContainerStyle?: Record<string, unknown>;
  itemContentStyle?: Record<string, unknown>;
  onSelect?: (name: string, value: string | number) => void;
  renderItem?: (props: {
    isSelected: boolean;
    label: string;
    value: string | number;
  }) => React.JSX.Element;
  renderValue?: (
    values:
      | { value: string | number; label: string }[]
      | { value: string | number; label: string }
  ) => React.JSX.Element;
};

export const isArrayTypeValue = (type: string) => {
  return type === fieldTypes.checkbox || type === fieldTypes.multiSelect;
};

export const shouldRemoveValueIfExist = (type: string) => {
  return type === fieldTypes.checkbox || type === fieldTypes.multiSelect;
};
