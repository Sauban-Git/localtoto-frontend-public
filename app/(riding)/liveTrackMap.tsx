
import { View, StyleSheet } from "react-native"
import { useRideStore } from "@/stores/bookingConfirmStore";
import MapView, { Marker, Polyline } from "react-native-maps";

const LiveTrackMap = () => {
  const data = useRideStore((state) => state.confirmationData)
  const routeData = data?.routeData
  // @ts-ignore
  const polylineCoords = routeData.coordinates.map(c => ({
    latitude: c[1],
    longitude: c[0],
  }));

  const start = polylineCoords[0];
  const end = polylineCoords[polylineCoords.length - 1];

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          ...start,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >

        {/* Start Marker */}
        <Marker coordinate={start} title="Start" pinColor="green" />

        {/* End Marker */}
        <Marker coordinate={end} title="Destination" pinColor="blue" />

        {/* Route Polyline */}
        <Polyline
          coordinates={polylineCoords}
          strokeColor="blue"
          strokeWidth={4}
        />

      </MapView>
    </View>
  );
}

export default LiveTrackMap

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});

