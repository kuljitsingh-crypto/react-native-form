import {
  Animated,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {Circle, Path, Svg} from 'react-native-svg';
import {FormContextProvider, useFormContext} from './formContext';
import {formColors} from './formColors';
import TogglePassword from './component/TogglePassword';
import {
  CheckboxFieldProps,
  RadioFieldProps,
  TextFieldProps,
} from './fieldTypes';

const NUMBER_REGEX = /^([0-9]*|[0-9]+\.{0,1}[0-9]{0,})$/;
const MIN_TOP_VALUE = 3;
const MAX_TOP_VALUE = 13;
const MAX_FONT_SIZE = 16;
const ANIMATION_DURATION = 200;
const MAX_SCALE = 1;
const MIN_SCALE = 0.75;
const MAX_LEFT_VALUE = 14;

type ReactNativeFormTypes = {
  initalValues?: Record<string, unknown>;
  formStyle?: Record<string, unknown>;
  submitting?: boolean;
  primaryColor?: string;
  onSubmit: (value: Record<string, unknown>) => void;
  onRender: (arg: {
    invalid: boolean;
    submitting: boolean;
    active: string | undefined;
    values: Record<string, unknown>;
    initialValues: Record<string, unknown>;
    touched: Record<string, boolean>;
    errors: Record<string, unknown>;
    changeFormValues: (
      name: string,
      type: string,
      value: string | undefined,
    ) => void;
    onSubmit: (event: GestureResponderEvent) => void;
  }) => React.JSX.Element;
};

const setNestedObjectValue = (
  name: string,
  value: string | number | undefined,
) => {
  const nameArr = name.replace(/\.{1,}$/, '').split('.');
  const arrObject: Record<string, unknown> = {};
  let obj = arrObject;
  const nameArrLength = nameArr.length;
  const lastIndx = nameArrLength - 1;
  for (let i = 0; i < nameArrLength; i++) {
    if (i === lastIndx) {
      obj[nameArr[i]] = value;
    } else {
      obj[nameArr[i]] = {};
      obj = obj[nameArr[i]] as Record<string, unknown>;
    }
  }
  return arrObject;
};

const pushValueToNestedObject = (
  name: string,
  obj: Record<string, unknown>,
  value: string | number,
  shouldRemoveIfExists?: boolean,
) => {
  const nameArr = name.replace(/\.{1,}$/, '').split('.');
  const arrObject: Record<string, unknown> = {};
  let current = arrObject,
    objRef = obj,
    temp,
    i;
  const lastIndx = nameArr.length - 1;
  for (i = 0; i < lastIndx; i++) {
    temp = nameArr[i];
    current[temp] = {};
    current = current[temp] as Record<string, unknown>;
    objRef = (objRef[temp] || {}) as Record<string, unknown>;
  }
  const lastKeyName = nameArr[lastIndx];
  const preValue = (objRef[lastKeyName] || []) as (string | number)[];
  const isValueExist = preValue.includes(value);
  const newValue = isValueExist
    ? shouldRemoveIfExists
      ? preValue.filter(v => v !== value)
      : [...preValue]
    : [...preValue, value];
  current[lastKeyName] = newValue;
  return arrObject;
};

const getNestedObjectValue = (name: string, obj: Record<string, unknown>) => {
  const nameArr = name.replace(/\.{1,}$/, '').split('.');
  let value = obj;
  for (let name of nameArr) {
    if (!(name in value)) {
      return undefined;
    }
    value = value[name] as Record<string, unknown>;
  }
  return value as unknown;
};

const CheckSvg = (props: {width: number; height: number; fill: string}) => {
  const {width = 24, height = 24, fill = '#000'} = props;
  return (
    <Svg viewBox="0 0 16 16" width={width} height={height}>
      <Path
        d="M0,6.51045l5.47909,5.48955l10.5209,-10.5105l-1.51045,-1.48955l-9.01045,9l-3.98955,-3.98955Z"
        fill={fill}></Path>
    </Svg>
  );
};

const TextField = (props: TextFieldProps) => {
  const {
    name,
    type,
    label,
    placeholder,
    mainContainerStyle: propsMainContainerStyle,
    contentContainerStyle: propsContentContainerStyle,
    textStyle: propsTextStyle,
    labelStyle: propsLabelStyle,
    togglePasswordType,
    enableTogglePasswordOption,
    fillOnCheck,
    shouldUseScaleAnimation = true,
    disabled = false,
    onChange,
    onFocus: propsOnFocus,
    onBlur: propsOnBlur,
    validate,
    formatValue,
  } = props;
  const formProps = useFormContext();
  const {
    values,
    touched,
    active,
    errors,
    primaryColor,
    changeFormValues,
    addFieldToTouched,
    updateActiveField,
    addFieldError,
  } = formProps;

  if (!label && !placeholder) {
    throw new Error('Either label or placeholder must be specified.');
  }

  if (!name) {
    throw new Error('Name must be specified.');
  }

  const value = (getNestedObjectValue(name, values) || '') as string;
  const isTouched = !!touched[name];
  const isFocused = active === name;
  const hasInput = !!value || isFocused;
  const errMsg = errors[name] as string;
  const showErrorMessage = isTouched && !!errMsg;
  const isLabelAnimationEnabled = !!(shouldUseScaleAnimation && label);
  const validTogglePasswordType =
    togglePasswordType === 'modern' ? 'modern' : 'classic';
  const shouldShowPwdToggleOption = !!(
    enableTogglePasswordOption && type === 'password'
  );

  const [showPwd, setShowPwd] = useState(false);
  const scaleAnim = useRef(new Animated.Value(value ? MIN_SCALE : MAX_SCALE));
  const transYAnim = useRef(
    new Animated.Value(value ? MIN_TOP_VALUE : MAX_TOP_VALUE),
  );

  const scaleOut = () => {
    if (isLabelAnimationEnabled) {
      Animated.parallel(
        [
          Animated.timing(scaleAnim.current, {
            toValue: MIN_SCALE,
            duration: ANIMATION_DURATION,
            useNativeDriver: true,
          }),
          Animated.timing(transYAnim.current, {
            toValue: MIN_TOP_VALUE,
            duration: ANIMATION_DURATION,
            useNativeDriver: true,
          }),
        ],
        {stopTogether: true},
      ).start();
    }
  };

  const scaleIn = () => {
    if (isLabelAnimationEnabled) {
      Animated.parallel([
        Animated.timing(scaleAnim.current, {
          toValue: MAX_SCALE,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(transYAnim.current, {
          toValue: MAX_TOP_VALUE,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const numberInputFormater = (value: string) => {
    if (type === 'number') {
      if (NUMBER_REGEX.test(value)) {
        return value;
      }
      return '';
    }
    return value;
  };

  const handleFocus = () => {
    if (disabled) return;
    if (typeof propsOnFocus === 'function') {
      propsOnFocus(name);
    }

    updateActiveField(name);
    if (isLabelAnimationEnabled) scaleOut();
  };

  const handleBlur = () => {
    if (disabled) return;

    if (typeof propsOnBlur === 'function') {
      propsOnBlur(name);
    }
    updateActiveField(name, false);
    if (isFocused && !isTouched) {
      addFieldToTouched(name);
    }
    if (!value && isLabelAnimationEnabled) {
      scaleIn();
    }
  };

  const validateUserValue = (value?: string | number) => {
    if (typeof validate === 'function') {
      const err = validate(value);
      addFieldError(name, err);
    }
  };

  const handleOnChangeText = (value: string) => {
    if (disabled) return;

    let finalValue =
      type === 'number'
        ? parseFloat(numberInputFormater(value))
        : numberInputFormater(value);
    if (typeof formatValue === 'function') {
      finalValue = formatValue(finalValue);
    }
    if (value && !finalValue) return;
    if (typeof onChange === 'function') {
      onChange(name, finalValue);
    }
    changeFormValues(name, type, finalValue);
    validateUserValue(finalValue);
  };

  const togglePassword = () => {
    setShowPwd(showPwd => !showPwd);
  };

  const extraProps = {
    ...(type === 'textBox' ? {multiline: true} : {}),
    ...(type === 'number'
      ? ({keyboardType: 'numeric'} as const)
      : ({keyboardType: 'default'} as const)),
    ...(type === 'password'
      ? {secureTextEntry: shouldShowPwdToggleOption ? !showPwd : true}
      : {secureTextEntry: false}),
  };

  const mainContainerStyle = [
    styles.textMainContainer,
    ...(propsMainContainerStyle ? [propsMainContainerStyle] : []),
    ...(disabled ? [styles.disabledTextMainContainer] : []),
  ];

  const contentContainerStyle = [
    styles.textContentContainer,
    ...(hasInput ? [styles.focusedTextContainer] : []),
    ...(showErrorMessage ? [styles.errTextContainer] : []),
    ...(placeholder && !label ? [styles.placeholderTextContainer] : []),
    ...(propsContentContainerStyle ? [propsContentContainerStyle] : []),
  ];

  const textStyle = [
    styles.textInput,
    ...(type === 'textBox' ? [styles.textBoxInput] : []),
    ...(shouldShowPwdToggleOption && validTogglePasswordType === 'modern'
      ? [styles.mordenPasswordInput]
      : []),
    ...(propsTextStyle ? [propsTextStyle] : []),
  ];

  const labelStyle = [
    styles.textLabel,
    ...(hasInput ? [styles.focusedTextLabel] : []),
    ...(propsLabelStyle ? [propsLabelStyle] : []),
    ...(isLabelAnimationEnabled
      ? [
          {
            transform: [
              {scale: scaleAnim.current},
              {translateX: MAX_LEFT_VALUE},
              {translateY: transYAnim.current},
            ],
          },
        ]
      : []),
  ];

  const placeholderMaybe = label ? {} : placeholder ? {placeholder} : {};

  useEffect(() => {
    validateUserValue(value);
  }, []);

  return (
    <View style={mainContainerStyle}>
      <View style={contentContainerStyle}>
        {label ? (
          <Animated.View style={labelStyle}>
            <Text numberOfLines={1}>{label}</Text>
          </Animated.View>
        ) : null}
        <TextInput
          id={name}
          value={value}
          style={textStyle}
          onChangeText={handleOnChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          selectTextOnFocus={!disabled}
          {...extraProps}
          {...placeholderMaybe}
        />
        {shouldShowPwdToggleOption && validTogglePasswordType === 'modern' ? (
          <TogglePassword
            showTogglePasswordOption={shouldShowPwdToggleOption}
            togglePasswordType={validTogglePasswordType}
            primaryColor={primaryColor}
            fillOnCheck={fillOnCheck}
            togglePassword={togglePassword}
            showPwd={showPwd}
            mainContainerStyle={label ? {transform: [{translateY: -14}]} : {}}
          />
        ) : null}
      </View>
      {showErrorMessage ? (
        <Text style={styles.textErrMsg}>{errMsg}</Text>
      ) : null}
      {shouldShowPwdToggleOption && validTogglePasswordType === 'classic' ? (
        <TogglePassword
          showTogglePasswordOption={shouldShowPwdToggleOption}
          togglePasswordType={validTogglePasswordType}
          primaryColor={primaryColor}
          fillOnCheck={fillOnCheck}
          togglePassword={togglePassword}
          showPwd={showPwd}
          mainContainerStyle={showErrorMessage ? {marginTop: 0} : {}}
        />
      ) : null}
    </View>
  );
};

const CheckboxField = (props: CheckboxFieldProps) => {
  const {
    name,
    label,
    value,
    type,
    required,
    fillOnCheck,
    iconFillColor,
    mainContainerStyle: propsMainContainerStyle,
    contentContainerStyle: propsContentContainerStyle,
    labelStyle: propsLabelStyle,
    checkboxStyle: propsCheckboxStyle,
    onSelect,
    renderItem,
  } = props;
  if (!name) {
    throw new Error('Name must be specified.');
  }
  const formProps = useFormContext();
  const {
    values,
    active,
    touched,
    primaryColor = formColors.gray,
    changeFormValues,
    updateActiveField,
    addFieldToTouched,
    addFieldError,
  } = formProps;
  const sValue = (getNestedObjectValue(name, values) || []) as (
    | string
    | number
  )[];

  const isChecked = sValue.includes(value);
  const isTouched = !!touched[name];
  const isFocused = active === name;

  const mainContainerStyle = [
    styles.checkboxMainContainer,
    ...(propsMainContainerStyle ? [propsMainContainerStyle] : []),
  ];

  const contentContainerStyle = [
    styles.checkboxContentContainer,
    ...(propsContentContainerStyle ? [propsContentContainerStyle] : []),
  ];

  const labelStyle = [
    styles.checkboxLabel,
    ...(propsLabelStyle ? [propsLabelStyle] : []),
  ];

  const checkStatusStyle = [
    styles.checkStatus,
    ...(fillOnCheck && isChecked ? [styles.filledCheckedStatus] : []),
    ...(fillOnCheck && isChecked
      ? [{backgroundColor: primaryColor, borderColor: primaryColor}]
      : [{borderColor: primaryColor}]),
    ...(propsCheckboxStyle ? [propsCheckboxStyle] : []),
  ];

  const handleOnPress = () => {
    if (typeof onSelect === 'function') {
      onSelect(name, value);
    }
    changeFormValues(name, type, value);
  };
  const handlePressIn = () => {
    updateActiveField(name);
  };
  const handlePressOut = () => {
    if (isFocused && !isTouched) {
      addFieldToTouched(name);
    }
    updateActiveField(name, false);
  };

  useEffect(() => {
    if (required) {
      const errMessage = sValue.length ? undefined : `${name} is required`;
      addFieldError(name, errMessage);
    }
  }, [sValue.length]);

  return (
    <Pressable
      style={mainContainerStyle}
      id={name}
      onPress={handleOnPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <View style={contentContainerStyle}>
        {typeof renderItem === 'function' ? (
          renderItem({isChecked, value, label})
        ) : (
          <React.Fragment>
            <View style={checkStatusStyle}>
              {isChecked ? (
                <CheckSvg
                  width={14}
                  height={14}
                  fill={
                    fillOnCheck
                      ? formColors.white
                      : iconFillColor || primaryColor
                  }
                />
              ) : null}
            </View>
            <Text style={labelStyle}>{label}</Text>
          </React.Fragment>
        )}
      </View>
    </Pressable>
  );
};

const RadioField = (props: RadioFieldProps) => {
  const {
    name,
    label,
    value,
    type,
    required,
    iconFillColor,
    fillOnCheck,
    mainContainerStyle: propsMainContainerStyle,
    contentContainerStyle: propsContentContainerStyle,
    labelStyle: propsLabelStyle,
    radioStyle: propsCheckboxStyle,
    onSelect,
    renderItem,
  } = props;
  const formProps = useFormContext();
  const {
    values,
    active,
    touched,
    primaryColor = formColors.gray,
    changeFormValues,
    updateActiveField,
    addFieldToTouched,
    addFieldError,
  } = formProps;
  if (!name) {
    throw new Error('Name must be specified.');
  }
  const sValue = (getNestedObjectValue(name, values) || '') as string | number;
  const isChecked = sValue === value;
  const isTouched = !!touched[name];
  const isFocused = active === name;

  const mainContainerStyle = [
    styles.radioMainContainer,
    ...(propsMainContainerStyle ? [propsMainContainerStyle] : []),
  ];

  const contentContainerStyle = [
    styles.radioContentContainer,
    ...(propsContentContainerStyle ? [propsContentContainerStyle] : []),
  ];

  const labelStyle = [
    styles.radioLabel,
    ...(propsLabelStyle ? [propsLabelStyle] : []),
  ];

  const checkStatusStyle = [
    styles.radioStatus,
    ...(fillOnCheck && isChecked ? [styles.filledRadioStatus] : []),
    ...(fillOnCheck && isChecked
      ? [{backgroundColor: primaryColor, borderColor: primaryColor}]
      : [{borderColor: primaryColor}]),
    ...(propsCheckboxStyle ? [propsCheckboxStyle] : []),
  ];

  const radioStyle = [
    styles.radio,
    ...(fillOnCheck ? [styles.filledRadio] : []),
    {
      backgroundColor: fillOnCheck
        ? formColors.white
        : iconFillColor || primaryColor,
    },
  ];

  const handleOnPress = () => {
    if (typeof onSelect === 'function') {
      onSelect(name, value);
    }
    changeFormValues(name, type, value);
  };
  const handlePressIn = () => {
    updateActiveField(name);
  };
  const handlePressOut = () => {
    if (isFocused && !isTouched) {
      addFieldToTouched(name);
    }
    updateActiveField(name, false);
  };

  useEffect(() => {
    if (required) {
      const errMessage = sValue.toString().length
        ? undefined
        : `${name} is required`;
      addFieldError(name, errMessage);
    }
  }, [sValue]);

  return (
    <Pressable
      style={mainContainerStyle}
      id={name}
      onPress={handleOnPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <View style={contentContainerStyle}>
        {typeof renderItem === 'function' ? (
          renderItem({isChecked, label, value})
        ) : (
          <React.Fragment>
            <View style={checkStatusStyle}>
              {isChecked ? <View style={radioStyle} /> : null}
            </View>
            <Text style={labelStyle}>{label}</Text>
          </React.Fragment>
        )}
      </View>
    </Pressable>
  );
};

export const Field = (
  props: TextFieldProps | CheckboxFieldProps | RadioFieldProps,
) => {
  const {type} = props;
  switch (type) {
    case 'text':
    case 'textBox':
    case 'number':
    case 'password':
      return <TextField {...props} />;
    case 'checkbox':
      return <CheckboxField {...props} />;
    case 'radio':
      return <RadioField {...props} />;
    default:
      return null;
  }
};

const initalizeFormValues = (initialValues?: Record<string, unknown>) => {
  if (
    initialValues &&
    typeof initialValues === 'object' &&
    initialValues.constructor === Object
  ) {
    return {...initialValues};
  }
  return {};
};

export const ReactNativeForm = (props: ReactNativeFormTypes) => {
  const {
    initalValues,
    onSubmit,
    formStyle: propsFormStyle,
    submitting,
    onRender,
    primaryColor = formColors.gray,
    ...rest
  } = props;
  const initalFormValues = initalizeFormValues(initalValues);
  const [formValues, setFormValues] = useState(initalFormValues);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [active, setActive] = useState<string | undefined>(undefined);
  const [errors, setErrors] = useState<Record<string, unknown>>({});

  const invalid = !!(errors && Object.keys(errors).length > 0);

  const changeFormValues = (
    name: string,
    type: string,
    value: string | number | undefined,
  ) => {
    if (type === 'checkbox') {
      if (value) {
        setFormValues(formValues => {
          const arrayValue = pushValueToNestedObject(
            name,
            formValues,
            value,
            true,
          );
          return {...formValues, ...arrayValue};
        });
      }
    } else {
      const finalValue = setNestedObjectValue(name, value);
      setFormValues(formValues => ({...formValues, ...finalValue}));
    }
  };

  const addFieldToTouched = (name: string) => {
    if (name && typeof name === 'string') {
      setTouched(touched => ({...touched, [name]: true}));
    }
  };

  const updateActiveField = (name: string, isFocused = true) => {
    if (name && typeof name === 'string') {
      setActive(active =>
        isFocused ? name : active === name ? undefined : active,
      );
    }
  };

  const addFieldError = (name: string, err: string | undefined | null) => {
    if (name && typeof name === 'string') {
      setErrors(errors => {
        const newErrors = {...errors};
        delete newErrors[name];
        if (err) {
          newErrors[name] = err;
        }
        return newErrors;
      });
    }
  };

  const handleFormSubmit = (event: GestureResponderEvent) => {
    if (submitting) return;
    if (typeof onSubmit === 'function') {
      onSubmit(formValues);
    }
  };

  const formStyle = [styles.form, ...(propsFormStyle ? [propsFormStyle] : [])];

  return (
    <View style={formStyle}>
      <FormContextProvider
        value={{
          values: formValues,
          touched,
          active,
          errors,
          primaryColor,
          changeFormValues,
          addFieldToTouched,
          updateActiveField,
          addFieldError,
        }}>
        {typeof onRender === 'function'
          ? onRender({
              values: formValues,
              invalid,
              errors,
              touched,
              active,
              submitting: !!submitting,
              initialValues: initalFormValues,
              changeFormValues,
              onSubmit: handleFormSubmit,
              ...rest,
            })
          : null}
      </FormContextProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {},
  textMainContainer: {paddingBottom: 12, paddingTop: 12, overflow: 'hidden'},
  disabledTextMainContainer: {
    opacity: 0.5,
  },
  textContentContainer: {
    borderWidth: 1,
    borderColor: formColors.gray,
    padding: 12,
    paddingTop: 16,
    paddingBottom: 4,
    borderRadius: 6,
  },
  focusedTextContainer: {
    borderColor: formColors.black,
  },
  errTextContainer: {
    borderColor: formColors.failColor,
  },
  placeholderTextContainer: {
    paddingTop: 12,
    paddingBottom: 12,
  },
  textLabel: {
    position: 'absolute',
    fontSize: MAX_FONT_SIZE,
    lineHeight: 24,
    top: 0,
    left: 0,
    color: formColors.gray,
    transformOrigin: 'left top',
    overflow: 'hidden',
    width: '100%',
  },
  focusedTextLabel: {
    width: '133%',
  },
  errTextLabel: {
    color: formColors.failColor,
  },
  textInput: {
    padding: 0,
    lineHeight: 24,
    fontSize: 16,
  },
  textBoxInput: {
    height: 80,
    textAlignVertical: 'top',
    maxHeight: 80,
  },
  passwordInput: {
    fontSize: 24,
  },
  mordenPasswordInput: {
    marginRight: 30,
  },
  textErrMsg: {
    padding: 8,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 2,
    lineHeight: 20,
    fontSize: 14,
    color: formColors.failColor,
  },
  checkboxMainContainer: {
    paddingBottom: 12,
    paddingTop: 12,
    marginBottom: 4,
    marginTop: 4,
  },
  checkboxContentContainer: {
    flexDirection: 'row',
  },
  checkboxLabel: {
    color: formColors.black,
  },
  checkStatus: {
    borderWidth: 2,
    borderColor: formColors.gray,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
    borderRadius: 2,
    paddingTop: 5,
    paddingBottom: 3,
    marginRight: 8,
  },
  filledCheckedStatus: {
    backgroundColor: formColors.gray,
  },
  radioMainContainer: {
    paddingBottom: 12,
    paddingTop: 12,
    marginBottom: 4,
    marginTop: 4,
  },
  radioContentContainer: {
    flexDirection: 'row',
  },
  radioLabel: {
    color: formColors.black,
  },
  radioStatus: {
    borderWidth: 2,
    borderColor: formColors.gray,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
    borderRadius: 50,
    marginRight: 8,
  },
  filledRadioStatus: {
    backgroundColor: formColors.gray,
  },
  radio: {
    width: 12,
    height: 12,
    borderRadius: 50,
  },
  filledRadio: {
    width: 8,
    height: 8,
  },
});
