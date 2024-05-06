import {StyleSheet, Text, View} from 'react-native';
import React, {useMemo} from 'react';
import {Field} from '../form';
import {FieldRadioGroupProps} from '../helpers/fieldTypes';
import {useOptionValidator} from '../helpers/optionValidationHook';

const FieldRadioGroup = (props: FieldRadioGroupProps) => {
  const {
    options = [],
    renderChildrenAs,
    mainContainerStyle: propsMainContainerStyle,
    ...rest
  } = props;
  useOptionValidator(options);
  const mainContainerStyle = {
    ...(renderChildrenAs === 'row' ? styles.rowFieldMainContainer : {}),
    ...(propsMainContainerStyle ? propsMainContainerStyle : {}),
  };

  const containerStyle =
    renderChildrenAs === 'row'
      ? styles.rowMainContainer
      : styles.columnMainContainer;

  return (
    <View style={containerStyle}>
      {options.map(option => {
        return (
          <Field
            key={option.value}
            type="radio"
            value={option.value}
            label={option.label}
            mainContainerStyle={mainContainerStyle}
            {...rest}
          />
        );
      })}
    </View>
  );
};

export default FieldRadioGroup;

const styles = StyleSheet.create({
  rowMainContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  columnMainContainer: {},
  rowFieldMainContainer: {
    paddingRight: 8,
    marginRight: 4,
  },
});
