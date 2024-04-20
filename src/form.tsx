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
  
  const NUMBER_REGEX = /^([0-9]*|[0-9]+\.{0,1}[0-9]{0,})$/;
  const MIN_TOP_VALUE = 3;
  const MAX_TOP_VALUE = 13;
  const MAX_FONT_SIZE = 16;
  const ANIMATION_DURATION = 200;
  const MAX_SCALE = 1;
  const MIN_SCALE = 0.75;
  const MAX_LEFT_VALUE = 14;
  
  const formColors = {
    white: '#fff',
    black: '#000',
    gray: 'gray',
    failColor: '#ff0000',
    disabledColor: '#e7e7e7',
    matterColor: '#b2b2b2',
  };
  
  const textFieldTypes = {
    text: 'text',
    textBox: 'textBox',
    number: 'number',
    password: 'password',
  } as const;
  
  type ReactNativeFormTypes = {
    initalValues?: Record<string, unknown>;
    formStyle?: Record<string, unknown>;
    submitting?: boolean;
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
  
  type TextFieldProps = {
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
    formatValue?: <T>(value: T) => T;
    onChange?: (name: string, value: string | undefined) => void;
    onFocus?: (name: string) => void;
    onBlur?: (name: string) => void;
    validate?: (value: string | undefined) => string | undefined;
  };
  
  type CheckboxFieldProps = {
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
  
    onSelect?: (name: string, value: string | number) => void;
  };
  
  type RadioFieldProps = {
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
  };
  
  type FormContextType = {
    values: Record<string, unknown>;
    touched: Record<string, unknown>;
    active: string | undefined;
    errors: Record<string, unknown>;
    changeFormValues: (
      name: string,
      type: string,
      value: string | undefined,
    ) => void;
    addFieldToTouched: (name: string) => void;
    updateActiveField: (name: string, isFocused?: boolean) => void;
    addFieldError: (name: string, err: string | undefined | null) => void;
  };
  
  const ReactNativeFormContext = createContext<FormContextType>(undefined as any);
  
  const setNestedObjectValue = (name: string, value: string | undefined) => {
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
    value: string,
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
    const preValue = (objRef[lastKeyName] || []) as string[];
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
  
  const HidePassword = (props: {
    width: number;
    height: number;
    stroke: string;
  }) => {
    const {width = 24, height = 24, stroke = '#000'} = props;
    return (
      <Svg viewBox="0 0 24 24" width={width} height={height} fill={'none'}>
        <Path
          d="M2 2L22 22"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  };
  
  const ShowPassword = (props: {
    width: number;
    height: number;
    stroke: string;
  }) => {
    const {width = 24, height = 24, stroke = '#000'} = props;
    return (
      <Svg viewBox="0 0 24 24" width={width} height={height} fill={'none'}>
        <Path
          d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M1 12C1 12 5 20 12 20C19 20 23 12 23 12"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Circle
          cx="12"
          cy="12"
          r="3"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
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
      shouldUseScaleAnimation = true,
      disabled = false,
      onChange,
      onFocus: propsOnFocus,
      onBlur: propsOnBlur,
      validate,
      formatValue,
    } = props;
    const formProps = useContext(ReactNativeFormContext);
    const {
      values,
      touched,
      active,
      errors,
      changeFormValues,
      addFieldToTouched,
      updateActiveField,
      addFieldError,
    } = formProps;
  
    const value = (getNestedObjectValue(name, values) || '') as string;
    const isTouched = !!touched[name];
    const isFocused = active === name;
    const hasInput = !!value || isFocused;
    const errMsg = errors[name] as string;
    const showErrorMessage = isTouched && !!errMsg;
  
    const scaleAnim = useRef(new Animated.Value(value ? MIN_SCALE : MAX_SCALE));
    const transYAnim = useRef(
      new Animated.Value(value ? MIN_TOP_VALUE : MAX_TOP_VALUE),
    );
  
    const scaleOut = () => {
      if (shouldUseScaleAnimation) {
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
      if (shouldUseScaleAnimation) {
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
      if (shouldUseScaleAnimation) scaleOut();
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
      if (!value && shouldUseScaleAnimation) {
        scaleIn();
      }
    };
  
    const validateUserValue = (value?: string) => {
      if (typeof validate === 'function') {
        const err = validate(value);
        addFieldError(name, err);
      }
    };
  
    const handleOnChangeText = (value: string) => {
      if (disabled) return;
  
      let finalValue = numberInputFormater(value);
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
  
    const extraProps = {
      ...(type === 'textBox' ? {multiline: true} : {}),
      ...(type === 'number'
        ? ({keyboardType: 'numeric'} as const)
        : ({keyboardType: 'default'} as const)),
      ...(type === 'password'
        ? {secureTextEntry: true}
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
      ...(propsContentContainerStyle ? [propsContentContainerStyle] : []),
    ];
  
    const textStyle = [
      styles.textInput,
      ...(propsTextStyle ? [propsTextStyle] : []),
    ];
  
    const labelStyle = [
      styles.textLabel,
      ...(hasInput ? [styles.focusedTextLabel] : []),
      ...(propsLabelStyle ? [propsLabelStyle] : []),
      ...(shouldUseScaleAnimation
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
            placeholder={placeholder}
            value={value}
            style={textStyle}
            onChangeText={handleOnChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            editable={!disabled}
            selectTextOnFocus={!disabled}
            {...extraProps}
          />
        </View>
        {showErrorMessage ? (
          <Text style={styles.textErrMsg}>{errMsg}</Text>
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
    } = props;
    const formProps = useContext(ReactNativeFormContext);
    const {
      values,
      active,
      touched,
      changeFormValues,
      updateActiveField,
      addFieldToTouched,
      addFieldError,
    } = formProps;
    const sValue = (getNestedObjectValue(name, values) || []) as string[];
    const isChecked = sValue.includes(value.toString());
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
      ...(propsCheckboxStyle ? [propsCheckboxStyle] : []),
    ];
  
    const handleOnPress = () => {
      if (typeof onSelect === 'function') {
        onSelect(name, value);
      }
      if (typeof value === 'number') {
        changeFormValues(name, type, value.toString());
      } else {
        changeFormValues(name, type, value);
      }
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
          <View style={checkStatusStyle}>
            {isChecked ? (
              <CheckSvg
                width={14}
                height={14}
                fill={
                  fillOnCheck
                    ? formColors.white
                    : iconFillColor || formColors.gray
                }
              />
            ) : null}
          </View>
          <Text style={labelStyle}>{label}</Text>
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
    } = props;
    const formProps = useContext(ReactNativeFormContext);
    const {
      values,
      active,
      touched,
      changeFormValues,
      updateActiveField,
      addFieldToTouched,
      addFieldError,
    } = formProps;
    const sValue = (getNestedObjectValue(name, values) || '') as string;
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
      ...(propsCheckboxStyle ? [propsCheckboxStyle] : []),
    ];
  
    const radioStyle = [
      styles.radio,
      ...(fillOnCheck ? [styles.filledRadio] : []),
      {
        backgroundColor: fillOnCheck
          ? formColors.white
          : iconFillColor || formColors.gray,
      },
    ];
  
    const handleOnPress = () => {
      if (typeof onSelect === 'function') {
        onSelect(name, value);
      }
      if (typeof value === 'number') {
        changeFormValues(name, type, value.toString());
      } else {
        changeFormValues(name, type, value);
      }
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
    }, [sValue]);
  
    return (
      <Pressable
        style={mainContainerStyle}
        id={name}
        onPress={handleOnPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}>
        <View style={contentContainerStyle}>
          <View style={checkStatusStyle}>
            {isChecked ? <View style={radioStyle} /> : null}
          </View>
          <Text style={labelStyle}>{label}</Text>
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
      value: string | undefined,
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
        <ReactNativeFormContext.Provider
          value={{
            values: formValues,
            touched,
            active,
            errors,
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
        </ReactNativeFormContext.Provider>
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
      color: formColors.gray,
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
      color: formColors.gray,
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
  