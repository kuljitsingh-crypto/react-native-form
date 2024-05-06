import {useRef} from 'react';
import {Animated} from 'react-native';

const MIN_TOP_VALUE = 3;
const MAX_TOP_VALUE = 13;
const ANIMATION_DURATION = 100;
const MAX_SCALE = 1;
const MIN_SCALE = 0.75;
const MAX_LEFT_VALUE = 14;

export const useScaleAnimation = (value: string) => {
  const scaleAnim = useRef(new Animated.Value(value ? MIN_SCALE : MAX_SCALE));
  const transYAnim = useRef(
    new Animated.Value(value ? MIN_TOP_VALUE : MAX_TOP_VALUE),
  );

  const scaleOut = () => {
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
  };

  const scaleIn = () => {
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
  };

  const scaleStyle = {
    transform: [
      {scale: scaleAnim.current},
      {translateX: MAX_LEFT_VALUE},
      {translateY: transYAnim.current},
    ],
  };

  return {scaleIn, scaleOut, scaleStyle};
};
