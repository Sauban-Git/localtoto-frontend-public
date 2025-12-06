
import { RouteResponse } from "@/services/olaMapsService";
import { useRideStore } from "@/stores/bookingConfirmStore";
import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker, Polyline, Region } from "react-native-maps";
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const LiveTrackMap = ({ isFullScreen = false }) => {

  // Blinking animation
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1.8, { duration: 900 }), -1, true);
  }, []);

  const rideData = useRideStore((state) => state.confirmationData)
  const animatedMarkerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: pulse.value < 1.4 ? 1 : 0.5,
  }));

  const initialRegion: Region = {
    latitude: rideData?.pickupCoords?.lat || 0,
    longitude: rideData?.pickupCoords?.lng || 0,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
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
      >
        {/* Route Polyline */}
        <Polyline
          coordinates={rideData?.routeData?.coordinates?.map(coord => ({
            latitude: coord[0],
            longitude: coord[1],
          })) || []}
          strokeWidth={5}
          strokeColor="#007AFF"
        />

        {/* Blinking Start Marker */}
        {rideData?.pickupCoords && (
          <Marker
            coordinate={{
              latitude: rideData.pickupCoords.lat,
              longitude: rideData.pickupCoords.lng,
            }}
          >
            <Animated.View style={[styles.greenDot, animatedMarkerStyle]} />
          </Marker>
        )}

      </MapView>
    </View>
  );
};

export default LiveTrackMap;

const styles = StyleSheet.create({
  normalContainer: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
  },
  fullScreen: {
    position: "absolute",
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  greenDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "green",
  },
});

