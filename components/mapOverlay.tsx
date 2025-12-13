
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import MapView, { MapPressEvent, Marker, Region } from "react-native-maps";
import { Modal, View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { type MapCoordinates } from "@/services/olaMapsService";

export default function MapOverlay({
  visible,
  onClose,
  onPickLocation,
}: {
  visible: boolean;
  onClose: () => void;
  onPickLocation: (location: MapCoordinates) => void
}) {

  const [region, setRegion] = useState<Region | null>(null);
  const [picked, setPicked] = useState<MapCoordinates | null>(
    null
  );

  useEffect(() => {
    if (!visible) return;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});

      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, [visible]);

  const handleMapPress = (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;

    const location = {
      lat: latitude,
      lng: longitude,
    };

    setPicked(location);

    // 🔥 expose to parent immediately
    onPickLocation(location);
  };

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View
          style={{
            height: 56,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 12,
            borderBottomWidth: 1,
            borderBottomColor: "#eee",
            backgroundColor: "white",
          }}
        >
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>

          <Text style={{ marginLeft: 12, fontSize: 16, fontWeight: "600" }}>
            Select location by tapping
          </Text>
        </View>

        {/* Map */}
        {region && (
          <MapView
            onPress={handleMapPress}
            style={{ flex: 1 }}
            region={region}
            showsUserLocation={false}
          >
            {picked && (
              <Marker
                pinColor="green"
                coordinate={{
                  latitude: picked.lat,
                  longitude: picked.lng,
                }}
              />
            )}
            <Marker
              coordinate={{
                latitude: region.latitude,
                longitude: region.longitude,
              }}
              title="Your location"
            />
          </MapView>
        )}

      </View>
      </SafeAreaView>
    </Modal>
  );
}
