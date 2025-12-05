
import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export default function LoadingOverlay({ message }: { message: string }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, {
      duration: 1800,
      easing: Easing.out(Easing.ease),
    });
  }, []);

  const animatedBarStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <View style={styles.track}>
          <Animated.View style={[styles.fill, animatedBarStyle]}>
            <Image
              source={require('./icons/rickshaw.png')}
              style={styles.icon}
              resizeMode="contain"
            />
          </Animated.View>
        </View>

        <Text style={styles.messageText}>
          {message || 'Loading...'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    inset: 0,
    zIndex: 120,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    maxWidth: 350,
    paddingHorizontal: 24,
  },
  track: {
    width: '100%',
    height: 12,
    backgroundColor: 'rgba(229,229,229,0.9)',
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 12,
  },
  fill: {
    height: '100%',
    backgroundColor: '#22c55e', // green-500
    borderRadius: 999,
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    top: -32, // similar to -top-8
    right: 0,
    height: 48,
    width: 48,
  },
  messageText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#374151', // gray-700
    fontWeight: '500',
  },
});

