import {
  Animated,
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {FieldSelectProps, fieldTypes} from '../helpers/fieldTypes';
import {Svg, Rect, G, Path} from 'react-native-svg';
import {formColors} from '../formColors';
import {useOpacityAnimation} from '../helpers/opacityAnimHook';
import {useFormContext} from '../helpers/formContext';
import {getNestedObjectValue} from '../helpers/dataHelper';
import {useOptionValidator} from '../helpers/optionValidationHook';
import {useScaleAnimation} from '../helpers/scaleAnimHook';

type SingleItemType = {value: number | string; label: string};
type itemType = SingleItemType | SingleItemType[];
type ItemProps = {
  item: SingleItemType;
  containerStyle?: Record<string, unknown>;
  selectedValue?: Record<string, unknown>;
  selectType:
    | (typeof fieldTypes)['singleSelect']
    | (typeof fieldTypes)['multiSelect'];
  onSelect: (item: SingleItemType) => void;
  renderItem?: (props: {
    isSelected: boolean;
    label: string;
    value: string | number;
  }) => React.JSX.Element;
};

type ItemContainerType = {
  options: SingleItemType[];
  selectedValue?: Record<string, unknown>;
  selectType:
    | (typeof fieldTypes)['singleSelect']
    | (typeof fieldTypes)['multiSelect'];
  isOpen: boolean;
  closeOnSelect?: boolean;
  confirmButtonText?: string;
  values:
    | {
        value: string | number;
        label: string;
      }
    | {
        value: string | number;
        label: string;
      }[];
  confirmButtonStyle?: Record<string, unknown>;
  confirmButtonTextStyle?: Record<string, unknown>;
  modalContentStyle?: Record<string, unknown>;
  itemContentStyle?: Record<string, unknown>;
  onSelect: (item: itemType) => void;
  onClose: () => void;
  renderItem?: (props: {
    isSelected: boolean;
    label: string;
    value: string | number;
  }) => React.JSX.Element;
};

type ViewContainerType = {
  value:
    | {
        value: string | number;
        label: string;
      }
    | {
        value: string | number;
        label: string;
      }[];
  strValue: string;
  label?: string;
  placeholder?: string;
  labelStyle?: Record<string, unknown>;
  focused: boolean;
  renderValue?: (
    values:
      | {value: string | number; label: string}[]
      | {value: string | number; label: string},
  ) => React.JSX.Element;
};

const DropDownIcon = (props: {
  width?: number;
  height?: number;
  fill?: string;
}) => {
  const {width = 24, height = 24, fill = formColors.black} = props;
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill={fill}>
      <Rect x="0" fill="none" width="24" height="24" />
      <G>
        <Path d="M7 10l5 5 5-5" />
      </G>
    </Svg>
  );
};

const DropUpIcon = (props: {
  width?: number;
  height?: number;
  fill?: string;
}) => {
  const {width = 24, height = 24, fill = formColors.black} = props;
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill={fill}
      transform={[{rotate: '135'}]}>
      <Rect x="0" fill="none" width="24" height="24" />
      <G>
        <Path d="M7 10l5 5 5-5" />
      </G>
    </Svg>
  );
};

const Item = (props: ItemProps) => {
  const {
    item,
    containerStyle: propsContainerStyle,
    selectType,
    selectedValue,
    onSelect,
    renderItem,
  } = props;
  const {label, value} = item;
  const isSelected = (selectedValue || {})[value] === value;
  const {containerBgStyle, onPressIn, onPressOut} = useOpacityAnimation();

  const handlePressIn = () => {
    onPressIn();
  };

  const handlePressOut = () => {
    onPressOut();
  };

  const handlePress = () => {
    onSelect(item);
  };

  const containerStyle = [
    styles.itemContainerStyle,
    ...(isSelected ? [styles.selectedItemContainer] : [containerBgStyle]),
    ...(propsContainerStyle ? [propsContainerStyle] : []),
  ];

  const textStyle = [styles.text, ...(isSelected ? [styles.selectedText] : [])];

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={containerStyle}>
      <Animated.View>
        {typeof renderItem === 'function' ? (
          renderItem({isSelected, value, label})
        ) : (
          <Text style={textStyle}>{label}</Text>
        )}
      </Animated.View>
    </Pressable>
  );
};

const formatPropValues = (
  values:
    | {
        value: string | number;
        label: string;
      }
    | {
        value: string | number;
        label: string;
      }[],
) => {
  if (Array.isArray(values)) {
    return values.reduce((pre, value) => {
      if (value && value.value && value.label) {
        pre[value.value] = value;
      }
      return pre;
    }, {} as Record<string, unknown>);
  } else if (values && values.value && values.label) {
    return {[values.value]: values};
  } else {
    return {};
  }
};

const formatPropSelectedValues = (
  values:
    | {
        value: string | number;
        label: string;
      }
    | {
        value: string | number;
        label: string;
      }[],
) => {
  if (Array.isArray(values)) {
    return values.reduce((pre, value) => {
      if (value && value.value) {
        pre[value.value] = value.value;
      }
      return pre;
    }, {} as Record<string, unknown>);
  } else if (values && values.value) {
    return {[values.value]: values.value};
  } else {
    return {};
  }
};

const ItemContainer = (props: ItemContainerType) => {
  const {
    options,
    values: propValues,
    selectType,
    selectedValue,
    isOpen,
    closeOnSelect = false,
    confirmButtonText = 'Confirm',
    confirmButtonStyle: propsConfirmButtonStyle,
    confirmButtonTextStyle: propsComfrimButtonTextStyle,
    modalContentStyle,
    itemContentStyle,
    onClose,
    onSelect,
    renderItem,
  } = props;
  const [localSelectedValues, setLocalSeletectValues] = useState(
    formatPropSelectedValues(propValues),
  );
  const localValues = useRef<Record<string, unknown>>(
    formatPropValues(propValues),
  );
  const shouldCloseOnSelect = closeOnSelect;
  const finalSelectedValues = shouldCloseOnSelect
    ? selectedValue
    : localSelectedValues;

  const contentStyle = [
    styles.itemWrapper,
    ...(shouldCloseOnSelect
      ? [styles.itemWrapperCloseHeight]
      : [styles.itemWrapperConfirmHeight]),
    ...(modalContentStyle ? [modalContentStyle] : []),
  ];

  const confirmButtonStyle = [
    styles.confirmBtn,
    ...(propsConfirmButtonStyle ? [propsConfirmButtonStyle] : []),
  ];

  const confirmBtnTextStyle = [
    styles.confirmBtnText,
    ...(propsComfrimButtonTextStyle ? [propsComfrimButtonTextStyle] : []),
  ];

  const handleOnSelect = (item: itemType) => {
    onSelect(item);
    onClose();
  };

  const handleOptionChange = (item: SingleItemType) => {
    if (shouldCloseOnSelect) {
      handleOnSelect(item);
    } else {
      const hasValue = item.value in localValues.current;
      if (hasValue) {
        delete localValues.current[item.value];
      } else {
        if (selectType === fieldTypes.singleSelect) {
          localValues.current = {};
        }
        localValues.current[item.value] = item;
      }

      setLocalSeletectValues(selected => {
        let finalValue = {...selected} as Record<string, unknown>;
        if (hasValue) {
          delete finalValue[item.value];
        } else {
          if (selectType === fieldTypes.singleSelect) {
            finalValue = {};
          }
          finalValue[item.value] = item.value;
        }
        return finalValue;
      });
    }
  };

  const handleOnPress = () => {
    const values = Object.values(localValues.current);
    const finalValue =
      selectType === fieldTypes.singleSelect ? values[0] : values;
    handleOnSelect(finalValue as itemType);
  };

  useEffect(() => {
    if (isOpen) {
      localValues.current = formatPropValues(propValues);
      setLocalSeletectValues(formatPropSelectedValues(propValues));
    }
  }, [isOpen]);

  return (
    <Modal transparent={true} visible={isOpen} animationType="slide">
      <SafeAreaView style={styles.modalScroll}>
        <Pressable style={styles.modalContent} onPress={onClose}>
          <View style={styles.itemsContentWrapper}>
            <FlatList
              style={contentStyle}
              data={options}
              renderItem={({item}) => (
                <Item
                  item={item}
                  selectedValue={finalSelectedValues}
                  selectType={selectType}
                  containerStyle={itemContentStyle}
                  onSelect={handleOptionChange}
                  renderItem={renderItem}
                />
              )}
              keyExtractor={item => item.value.toString()}
            />
            {shouldCloseOnSelect ? null : (
              <Pressable style={confirmButtonStyle} onPress={handleOnPress}>
                <Text style={confirmBtnTextStyle}>{confirmButtonText}</Text>
              </Pressable>
            )}
          </View>
        </Pressable>
      </SafeAreaView>
    </Modal>
  );
};

const ViewContainer = (props: ViewContainerType) => {
  const {
    value,
    strValue,
    label,
    labelStyle: propsLabelStyle,
    placeholder,
    focused,
    renderValue,
  } = props;
  const hasValue = strValue || focused;
  const showplaceholder = !label && placeholder && !strValue;
  const labelStyle = [
    styles.label,
    ...(hasValue ? [styles.focusedLabel] : []),
    ...(propsLabelStyle ? [propsLabelStyle] : []),
  ];
  const placeholderStyle = [
    styles.placeholder,
    ...(propsLabelStyle ? [propsLabelStyle] : []),
  ];

  const viewContainerStyle = [
    styles.viewContainer,
    ...(placeholder && !label ? [styles.placeholderViewContainer] : []),
    ...(hasValue ? [styles.focusViewContainer] : []),
  ];
  const iconStyle = [
    styles.iconView,
    ...(placeholder && !label ? [styles.placeholderIconView] : []),
  ];

  return (
    <View style={viewContainerStyle}>
      {label ? (
        <Animated.View style={labelStyle}>
          <Text numberOfLines={1} style={styles.labelText}>
            {label}
          </Text>
        </Animated.View>
      ) : null}
      {showplaceholder ? (
        <View style={placeholderStyle}>
          <Text numberOfLines={1} style={styles.placeholderText}>
            {placeholder}
          </Text>
        </View>
      ) : null}
      {showplaceholder ? null : typeof renderValue === 'function' ? (
        renderValue(value)
      ) : (
        <Text style={styles.valueText} numberOfLines={1}>
          {strValue}
        </Text>
      )}
      <View style={iconStyle}>
        {focused ? <DropUpIcon /> : <DropDownIcon />}
      </View>
    </View>
  );
};

const FieldSelect = (props: FieldSelectProps) => {
  const {
    name,
    label,
    placeholder,
    multiple = false,
    options = [],
    mainContainerStyle: propsMainContainer,
    itemContentStyle,
    itemsContainerStyle,
    closeOnSelect,
    confirmButtonTextStyle,
    confirmButtonText,
    confirmButtonStyle,
    required,
    renderItem,
    renderValue,
  } = props;

  if (!label && !placeholder) {
    throw new Error('Either label or placeholder must be specified.');
  }
  if (!name) {
    throw new Error('Name must be specified.');
  }
  useOptionValidator(options);

  const selectType = multiple
    ? fieldTypes.multiSelect
    : fieldTypes.singleSelect;

  const [showContainer, setShowContainer] = useState(false);
  const formProps = useFormContext();
  const {
    values,
    touched,
    active,
    addFieldError,
    changeFormValues,
    addFieldToTouched,
    updateActiveField,
  } = formProps;
  const sValue = (getNestedObjectValue(name, values) || '') as
    | {
        value: string | number;
        label: string;
      }
    | {
        value: string | number;
        label: string;
      }[];

  const strValue = useMemo(
    () =>
      Array.isArray(sValue)
        ? sValue.map(v => v.label as string | number).toString()
        : (sValue.label as string),
    [sValue],
  );

  const selectedValue = useMemo(() => {
    if (Array.isArray(sValue)) {
      return sValue.reduce((pre, value, indx) => {
        pre[value.value] = value.value;
        return pre;
      }, {} as Record<string, unknown>);
    } else {
      return sValue && sValue.value
        ? {[sValue.value as string | number]: sValue.value}
        : {};
    }
  }, [sValue]);

  const {scaleIn, scaleOut, scaleStyle} = useScaleAnimation(strValue);
  const [pressed, setPressed] = useState(false);
  const isTouched = !!touched[name];

  const onOptionChange = (item: itemType) => {
    changeFormValues(name, selectType, item);
    if (label) scaleOut();
  };

  const onClose = () => {
    setShowContainer(false);
  };

  const onOpen = () => {
    setShowContainer(true);
  };

  const handlePressIn = () => {
    if (label) scaleOut();
    setPressed(true);
    updateActiveField(name);
  };

  const handlePressOut = () => {
    if (!strValue && label) scaleIn();
    setPressed(false);
    updateActiveField(name, false);
    if (!isTouched) {
      addFieldToTouched(name);
    }
  };

  const mainContainerStyle = [
    styles.mainContainer,
    ...(propsMainContainer ? [propsMainContainer] : []),
  ];

  useEffect(() => {
    if (required) {
      const errMessage = strValue ? undefined : `${name} is required.`;
      addFieldError(name, errMessage);
    }
  }, [strValue]);

  return (
    <Pressable
      onPress={onOpen}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={mainContainerStyle}>
      <ViewContainer
        value={sValue}
        strValue={strValue}
        label={label}
        placeholder={placeholder}
        labelStyle={label ? scaleStyle : {}}
        focused={pressed}
        renderValue={renderValue}
      />

      <ItemContainer
        options={options}
        selectType={selectType}
        selectedValue={selectedValue}
        values={sValue}
        isOpen={showContainer}
        itemContentStyle={itemContentStyle}
        modalContentStyle={itemsContainerStyle}
        closeOnSelect={closeOnSelect}
        confirmButtonTextStyle={confirmButtonTextStyle}
        confirmButtonText={confirmButtonText}
        confirmButtonStyle={confirmButtonStyle}
        onClose={onClose}
        onSelect={onOptionChange}
        renderItem={renderItem}
      />
    </Pressable>
  );
};

export default FieldSelect;

const styles = StyleSheet.create({
  mainContainer: {marginBottom: 8, marginTop: 8},
  itemContainerStyle: {
    marginTop: 2,
    marginBottom: 2,
    padding: 8,
    paddingTop: 12,
    paddingBottom: 12,
    color: formColors.black,
  },
  selectedItemContainer: {
    backgroundColor: formColors.selectedColor,
    color: formColors.black,
  },
  text: {
    color: formColors.black,
  },
  selectedText: {
    color: formColors.black,
  },
  itemsContentWrapper: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemWrapper: {
    width: '90%',
    backgroundColor: formColors.white,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  itemWrapperCloseHeight: {
    maxHeight: '96%',
  },
  itemWrapperConfirmHeight: {
    maxHeight: '89%',
  },
  modalContent: {
    backgroundColor: formColors.transparentBlack,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  modalScroll: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  viewContainer: {
    backgroundColor: formColors.white,
    padding: 16,
    borderWidth: 1,
    borderColor: formColors.gray,
    borderRadius: 6,
    paddingBottom: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
  },
  focusViewContainer: {
    borderColor: formColors.black,
  },
  placeholderViewContainer: {
    paddingVertical: 12,
  },
  label: {
    position: 'absolute',
    fontSize: 16,
    lineHeight: 24,
    top: 0,
    left: 0,
    color: formColors.gray,
    transformOrigin: 'left top',
    overflow: 'hidden',
    width: '100%',
  },
  focusedLabel: {
    width: '133%',
  },
  placeholder: {
    flexGrow: 1,
    overflow: 'hidden',
    marginRight: 8,
  },
  placeholderText: {
    color: formColors.placeholderColor,
  },
  labelText: {
    color: formColors.gray,
  },

  valueText: {
    padding: 0,
    color: formColors.black,
    flexGrow: 1,
    overflow: 'hidden',
    marginRight: 8,
  },
  iconView: {
    marginLeft: 'auto',
    position: 'relative',
    top: -4,
  },
  placeholderIconView: {
    top: 0,
  },
  confirmBtn: {
    backgroundColor: formColors.fieldSelectBtnColor,
    width: '90%',
    padding: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',

    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    color: formColors.black,
  },
  disabledConfirmBtn: {
    opacity: 0.5,
  },
  confirmBtnText: {
    color: formColors.black,
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 32,
  },
});
