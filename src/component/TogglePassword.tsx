import React, {useEffect, useRef, useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import {Circle, Path, Svg} from 'react-native-svg';
import {formColors} from '../formColors';

const ANIMATION_DURATION = 100;

type TogglePasswordCompProps = {
  fillOnCheck?: boolean;
  togglePasswordType: 'classic' | 'modern';
  primaryColor?: string;
  showTogglePasswordOption: boolean;
  showPwd: boolean;
  mainContainerStyle?: Record<string, unknown>;
  togglePassword: () => void;
};

const HidePasswordIcon = (props: {
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

const ShowPasswordIcon = (props: {
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

const CheckSvgIcon = (props: {width: number; height: number; fill: string}) => {
  const {width = 24, height = 24, fill = '#000'} = props;
  return (
    <Svg viewBox="0 0 16 16" width={width} height={height}>
      <Path
        d="M0,6.51045l5.47909,5.48955l10.5209,-10.5105l-1.51045,-1.48955l-9.01045,9l-3.98955,-3.98955Z"
        fill={fill}></Path>
    </Svg>
  );
};

const ClassicTogglePasswordComp = (props: {
  fillOnCheck?: boolean;
  primaryColor?: string;
  isChecked: boolean;
}) => {
  const {fillOnCheck, primaryColor = formColors.gray, isChecked} = props;
  const fillColor = fillOnCheck ? formColors.white : primaryColor;
  const checkStatusStyle = [
    styles.classicCheckStatus,
    {
      borderColor: primaryColor,
      ...(fillOnCheck && isChecked ? {backgroundColor: primaryColor} : {}),
    },
  ];
  return (
    <View style={styles.classicMainStyle}>
      <View style={checkStatusStyle}>
        {isChecked ? (
          <CheckSvgIcon width={14} height={14} fill={fillColor} />
        ) : null}
      </View>
      <Text style={styles.classicTextStyle}>Show password</Text>
    </View>
  );
};

const MordenTogglePasswordComp = (props: {
  primaryColor?: string;
  isChecked: boolean;
}) => {
  const {primaryColor = formColors.gray, isChecked} = props;
  const fillColor = primaryColor;
  const checkStatusStyle = [styles.modernCheckstatus];
  return (
    <View style={styles.morderMainStyle}>
      <View style={checkStatusStyle}>
        {isChecked ? (
          <ShowPasswordIcon width={20} height={20} stroke={fillColor} />
        ) : (
          <HidePasswordIcon width={20} height={20} stroke={fillColor} />
        )}
      </View>
    </View>
  );
};

const TogglePassword = (props: TogglePasswordCompProps) => {
  const {
    showTogglePasswordOption,
    togglePasswordType,
    fillOnCheck,
    primaryColor,
    showPwd,
    mainContainerStyle: propsMainContainerStyle,
    togglePassword,
  } = props;

  const opacityAnim = useRef(new Animated.Value(1));

  const opacityIn = () => {
    Animated.timing(opacityAnim.current, {
      duration: ANIMATION_DURATION,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const opacityOut = () => {
    Animated.timing(opacityAnim.current, {
      duration: ANIMATION_DURATION,
      toValue: 0.2,
      useNativeDriver: true,
    }).start();
  };

  const handlePressIn = () => {
    opacityOut();
  };

  const handlePressOut = () => {
    opacityIn();
    togglePassword();
  };

  const mainContainerStyle = [
    styles.mainContainer,
    ...(togglePasswordType === 'modern' ? [styles.modernMainContainer] : []),
    ...(propsMainContainerStyle ? [propsMainContainerStyle] : []),
  ];

  return showTogglePasswordOption ? (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={mainContainerStyle}>
      <Animated.View style={{opacity: opacityAnim.current}}>
        {togglePasswordType === 'classic' ? (
          <ClassicTogglePasswordComp
            fillOnCheck={fillOnCheck}
            primaryColor={primaryColor}
            isChecked={showPwd}
          />
        ) : (
          <MordenTogglePasswordComp
            primaryColor={primaryColor}
            isChecked={showPwd}
          />
        )}
      </Animated.View>
    </Pressable>
  ) : null;
};

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 6,
    marginBottom: 6,
  },
  modernMainContainer: {
    position: 'absolute',
    padding: 2,
    right: 2,
    top: '50%',
    height: 36,
    transform: [{translateY: -12}],
    width: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  classicMainStyle: {
    paddingTop: 4,
    paddingBottom: 4,
    flexDirection: 'row',
  },
  classicCheckStatus: {
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
  classicTextStyle: {
    color: formColors.black,
  },
  morderMainStyle: {},
  modernCheckstatus: {},
});

export default TogglePassword;
