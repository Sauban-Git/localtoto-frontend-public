
import React, { useEffect } from "react";
import { View } from "react-native";
import Svg, { Path, Defs, ClipPath } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  Easing,
  SharedValue,
} from "react-native-reanimated";

const AnimatedPath = Animated.createAnimatedComponent(Path);

type WaveProgressProps = {
  progress: SharedValue<number>; // 0 to 100
};

const WaveBlobProgress = ({ progress }: WaveProgressProps) => {
  const waveShift = useSharedValue(0);

  useEffect(() => {
    waveShift.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedWave = useAnimatedProps(() => {
    'worklet';
    const fillY = 80 - (progress.value / 100) * 120; // map 0-100 to -40 -> 80
    const waveMove = waveShift.value * 20;

    const wave = `
      M -90 ${fillY}
      Q -45 ${fillY + 10 * Math.sin(waveMove)}, 0 ${fillY}
      T 90 ${fillY}
      V 100
      H -90
      Z
    `;

    return { d: wave };
  });

  // Single blob shape
  const blob = `
    M37.3 -55C50.4 -46.3 61.2 -34.5 67.8 -20.7C74.4 -6.9 76.9 9 71.7 23C66.5 37 53.6 49.2 38.4 58.3C23.2 67.4 5.8 73.5 -9 71.2C-23.7 68.8 -35.8 58 -47.1 46.2C-58.4 34.4 -68.9 21.7 -71.4 7.9C-73.9 -5.9 -68.4 -20.7 -60 -34.6C-51.6 -48.5 -40.3 -61.5 -26.3 -68.6C-12.3 -75.8 4.4 -77.1 19.6 -72.5C34.9 -67.9 48.7 -57.6 37.3 -55Z
  `;

  return (
    <View style={{ width: 180, height: 180, justifyContent: "center", alignItems: "center" }}>
      <Svg width={180} height={180} viewBox="-90 -90 180 180">
        <Defs>
          <ClipPath id="blobClip">
            <Path d={blob} fill="white" />
          </ClipPath>
        </Defs>

        {/* Background blob */}
        <Path d={blob} fill="#1e1e1e" opacity={0.25} />

        {/* Animated wave */}
        <AnimatedPath
          animatedProps={animatedWave}
          fill="#2ecc71"
          clipPath="url(#blobClip)"
          opacity={0.85}
        />

        {/* Blob border */}
        <Path d={blob} fill="none" stroke="#2ecc71" strokeWidth={2.5} />
      </Svg>
    </View>
  );
};

export default WaveBlobProgress;

