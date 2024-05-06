import {useRef, useState} from 'react';
import {Animated} from 'react-native';
import {formColors} from '../formColors';

const ANIMATION_DURATION = 100;

export const useOpacityAnimation = () => {
  const opacityAnim = useRef(new Animated.Value(1));
  const [pressed, setPressed] = useState(false);

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
      toValue: 0.6,
      useNativeDriver: true,
    }).start();
  };

  const onPressIn = () => {
    // opacityOut();
    setPressed(true);
  };

  const onPressOut = () => {
    // opacityIn();
    setPressed(false);
  };

  const containerBgStyle = pressed
    ? {backgroundColor: formColors.touchableColor}
    : {};

  return {
    containerBgStyle,
    onPressIn,
    onPressOut,
    opacityAnimRef: opacityAnim.current,
  };
};
