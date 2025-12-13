
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import MapView, { Marker, Region } from "react-native-maps";
import { Modal, View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MapOverlay({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {

  const [region, setRegion] = useState<Region | null>(null);

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

  return (
    <Modal visible={visible} animationType="slide">
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
            Select location
          </Text>
        </View>

        {/* Map */}
        {region && (
          <MapView
            style={{ flex: 1 }}
            region={region}
            showsUserLocation={false}
          >
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
    </Modal>
  );
}
