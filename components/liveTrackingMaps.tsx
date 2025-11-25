import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Animated } from 'react-native';
import MapView, { Marker, Polyline, LatLng, Region } from 'react-native-maps';
import * as Location from 'expo-location';

interface LiveTrackingMapProps {
  pickup: { lat: number; lng: number };
  dropoff?: { lat: number; lng: number };
  driverLocation?: { lat: number; lng: number };
  routeData?: { coordinates?: [number, number][] };
  height?: number;
  showDrop?: boolean;
  allowFullscreen?: boolean;
}

const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({
  pickup,
  dropoff,
  driverLocation,
  routeData,
  height = 260,
  showDrop = false,
  allowFullscreen = true,
}) => {
  const mapRef = useRef<MapView | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: pickup.lat,
    longitude: pickup.lng,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [followDriver, setFollowDriver] = useState(true);
  const [etaText, setEtaText] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const driverRotation = useRef(new Animated.Value(0)).current;
  const prevDriverLocRef = useRef<{ lat: number; lng: number } | null>(null);

  // Center map on driver if followDriver
  useEffect(() => {
    if (followDriver && driverLocation && mapRef.current) {
      mapRef.current.animateCamera(
        {
          center: {
            latitude: driverLocation.lat,
            longitude: driverLocation.lng,
          },
          zoom: 16,
        },
        { duration: 300 }
      );
    }
  }, [driverLocation, followDriver]);

  // Driver rotation animation
  useEffect(() => {
    if (!driverLocation) return;
    const prev = prevDriverLocRef.current;
    prevDriverLocRef.current = driverLocation;
    if (!prev) return;

    const toRad = (d: number) => (d * Math.PI) / 180;
    const toDeg = (r: number) => (r * 180) / Math.PI;

    const lat1 = toRad(prev.lat);
    const lat2 = toRad(driverLocation.lat);
    const dLng = toRad(driverLocation.lng - prev.lng);
    const y = Math.sin(dLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.cos(lat2) * Math.cos(dLng) - Math.sin(lat1) * Math.sin(lat2);
    let brng = toDeg(Math.atan2(y, x));
    if (!Number.isFinite(brng)) brng = 0;

    Animated.timing(driverRotation, {
      toValue: brng,
      duration: 160,
      useNativeDriver: true,
    }).start();
  }, [driverLocation]);

  // ETA calculation
  useEffect(() => {
    const target = showDrop && dropoff ? dropoff : pickup;
    if (!driverLocation || !target) {
      setEtaText(null);
      return;
    }

    const toRad = (d: number) => (d * Math.PI) / 180;
    const haversineKm = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
      const R = 6371;
      const dLat = toRad(b.lat - a.lat);
      const dLng = toRad(b.lng - a.lng);
      const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
      return 2 * R * Math.asin(Math.sqrt(s));
    };

    const distanceKm = haversineKm(driverLocation, target);
    const speedKmh = distanceKm >= 8 ? 25 : distanceKm >= 3 ? 20 : 15;
    const minutes = Math.max(1, Math.min(120, Math.round((distanceKm / speedKmh) * 60)));
    setEtaText(`${minutes} min`);
  }, [driverLocation, pickup, dropoff, showDrop]);

  // Locate user
  const locateUser = async () => {
    setFollowDriver(false);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;
    const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
    if (mapRef.current) {
      mapRef.current.animateCamera(
        { center: { latitude: location.coords.latitude, longitude: location.coords.longitude }, zoom: 16 },
        { duration: 300 }
      );
    }
  };

  // Locate driver
  const locateDriver = () => {
    if (!driverLocation) return;
    setFollowDriver(true);
    if (mapRef.current) {
      mapRef.current.animateCamera(
        { center: { latitude: driverLocation.lat, longitude: driverLocation.lng }, zoom: 16 },
        { duration: 300 }
      );
    }
  };

  return (
    <View style={[styles.container, { height: isFullscreen ? Dimensions.get('window').height : height }]}>
      <MapView ref={mapRef} style={styles.map} initialRegion={region} showsUserLocation={true}>
        <Marker coordinate={{ latitude: pickup.lat, longitude: pickup.lng }} pinColor="#16a34a" />
        {showDrop && dropoff && <Marker coordinate={{ latitude: dropoff.lat, longitude: dropoff.lng }} pinColor="#1d4ed8" />}
        {driverLocation && (
          <Marker coordinate={{ latitude: driverLocation.lat, longitude: driverLocation.lng }} anchor={{ x: 0.5, y: 0.5 }}>
            <Animated.Image
              source={require('@/assets/images/rickshaw.png')}
              style={{
                width: 40,
                height: 38,
                transform: [
                  {
                    rotate: driverRotation.interpolate({
                      inputRange: [-360, 360],
                      outputRange: ['-360deg', '360deg'],
                    }),
                  },
                ],
              }}
            />
          </Marker>
        )}
        {routeData?.coordinates?.length && (
          <Polyline
            coordinates={routeData.coordinates.map((c) => ({ latitude: c[1], longitude: c[0] }))}
            strokeColor="#2563eb"
            strokeWidth={4}
          />
        )}
      </MapView>

      {/* Buttons */}
      <View style={styles.buttons}>
        <TouchableOpacity onPress={locateUser} style={styles.button}>
          <Text style={styles.buttonText}>Locate Me</Text>
        </TouchableOpacity>

        {driverLocation && (
          <TouchableOpacity onPress={locateDriver} style={styles.button}>
            <Text style={styles.buttonText}>Locate Driver</Text>
          </TouchableOpacity>
        )}

        {allowFullscreen && (
          <TouchableOpacity onPress={() => setIsFullscreen((v) => !v)} style={styles.button}>
            <Text style={styles.buttonText}>{isFullscreen ? 'Close' : 'Full screen'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ETA Badge */}
      {etaText && (
        <View style={styles.eta}>
          <Text style={styles.etaText}>ETA: {etaText}</Text>
        </View>
      )}
    </View>
  );
};

export default LiveTrackingMap;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  buttons: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'column',
    gap: 8,
  },
  button: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 6,
  },
  buttonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  eta: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  etaText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
});
