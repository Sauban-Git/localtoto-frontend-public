
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

export default function AnimatedBackground() {
  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;
  const anim3 = useRef(new Animated.Value(0)).current;

  const animateBlob = (value: Animated.Value) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(value, { toValue: 1, duration: 6000, useNativeDriver: true }),
        Animated.timing(value, { toValue: 0, duration: 6000, useNativeDriver: true }),
      ])
    ).start();
  };

  useEffect(() => {
    animateBlob(anim1);
    animateBlob(anim2);
    animateBlob(anim3);
  }, []);

  const interpolateScale = (val: Animated.Value) =>
    val.interpolate({ inputRange: [0, 1], outputRange: [1, 1.3] });

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View
        style={[
          styles.blob,
          styles.greenBlob,
          { transform: [{ scale: interpolateScale(anim1) }] },
        ]}
      />
      <Animated.View
        style={[
          styles.blob,
          styles.blueBlob,
          { transform: [{ scale: interpolateScale(anim2) }] },
        ]}
      />
      <Animated.View
        style={[
          styles.blob,
          styles.yellowBlob,
          { transform: [{ scale: interpolateScale(anim3) }] },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 300,
    opacity: 0.45,
    filter: "blur(30px)", // expo web uses this; mobile ignores safely
  },
  greenBlob: {
    backgroundColor: "#c6f6d5",
    top: -140,
    right: -140,
  },
  blueBlob: {
    backgroundColor: "#bee3f8",
    bottom: -140,
    left: -140,
  },
  yellowBlob: {
    backgroundColor: "#fefcbf",
    top: 200,
    left: 100,
  },
});
