
import { useRideStore } from "@/stores/bookingConfirmStore";
import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker, Polyline, Region } from "react-native-maps";
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const LiveTrackMap = ({ isFullScreen = false }) => {
  const pulse = useSharedValue(1);
  const mapRef = useRef<MapView>(null);
  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.8, { duration: 900 }),
      -1,
      true
    );
  }, []);

  const rideData = useRideStore((state) => state.confirmationData);

  useEffect(() => {
    if (rideData?.pickupCoords && mapRef.current) {
      const region: Region = {
        latitude: rideData.pickupCoords.lat,
        longitude: rideData.pickupCoords.lng,
        latitudeDelta: 0.0005,  // very close
        longitudeDelta: 0.0005,
      };
      mapRef.current.animateToRegion(region, 500); // 500ms animation
    }
  }, [rideData?.pickupCoords]);

  const animatedMarkerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(pulse.value, [1, 1.8], [1, 0.5]);
    return {
      transform: [{ scale: pulse.value }],
      opacity,
    };
  });

  const initialRegion: Region = {
    latitude: rideData?.pickupCoords?.lat || 0,
    longitude: rideData?.pickupCoords?.lng || 0,
    latitudeDelta: 0.0005,
    longitudeDelta: 0.0005,
  };

  return (
    <View style={isFullScreen ? styles.fullScreen : styles.normalContainer}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={initialRegion}
        showsUserLocation={true}
        zoomEnabled={true}
        scrollEnabled={true}
        rotateEnabled={true}
        loadingEnabled={true} // shows loader while map is loading
        mapType="standard"
      >
        {/* Route Polyline */}
        <Polyline
          coordinates={
            rideData?.routeData?.coordinates?.map(coord => ({
              latitude: coord[1],
              longitude: coord[0],
            })) || []
          }
          strokeWidth={6}
          strokeColor="#007AFF"
          lineJoin="round"
          lineCap="round"
        />

        {/* Pulsing Pickup Marker */}
        {rideData?.pickupCoords && (
          <Marker
            coordinate={{
              latitude: rideData.pickupCoords.lat,
              longitude: rideData.pickupCoords.lng,
            }}
          >
            <Animated.View style={[styles.greenDot, animatedMarkerStyle]}>
              <View style={styles.innerDot} />
            </Animated.View>
          </Marker>
        )}
        {/* Drop Marker (blue) */}
        {rideData?.dropCoords && (
          <Marker
            coordinate={{
              latitude: rideData.dropCoords.lat,
              longitude: rideData.dropCoords.lng
            }}
          >
            <View style={styles.blueDot}>
              <View style={styles.innerBlueDot} />
            </View>
          </Marker>
        )}

      </MapView>
    </View>
  );
};

export default LiveTrackMap;

const styles = StyleSheet.create({
  normalContainer: {
    width: "90%",
    height: 400,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  fullScreen: {
    position: "absolute",
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  greenDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(0, 200, 0, 0.3)", // outer pulse glow
    justifyContent: "center",
    alignItems: "center",
  },
  innerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "green", // solid inner dot
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  blueDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(0, 0, 255, 0.3)", // outer glow
    justifyContent: "center",
    alignItems: "center",
  },
  innerBlueDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "blue",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
});

