export const textFieldTypes = {
  text: 'text',
  textBox: 'textBox',
  number: 'number',
  password: 'password',
} as const;

export type TextFieldProps = {
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
  togglePasswordType?: 'classic' | 'modern';
  fillOnCheck?: boolean;
  formatValue?: <T>(value: T) => T;
  onChange?: (name: string, value: string | number | undefined) => void;
  onFocus?: (name: string) => void;
  onBlur?: (name: string) => void;
  validate?: (value: string | number | undefined) => string | undefined;
};

export type CheckboxFieldProps = {
  name: string;
  type: 'checkbox';
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
  type: 'radio';
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
  renderChildrenAs?: 'column' | 'row';
  options: {value: string | number; label: string}[];
} & Omit<CheckboxFieldProps, 'value' | 'label' | 'type'>;

export type FieldRadioGroupProps = {
  renderChildrenAs?: 'column' | 'row';
  options: {value: string | number; label: string}[];
} & Omit<RadioFieldProps, 'value' | 'label' | 'type'>;
