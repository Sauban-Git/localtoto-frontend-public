
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MapCoordinates } from "@/services/olaMapsService";
import OlaSearchInput from "./olaSearchInput";
import { Ionicons } from "@expo/vector-icons";

export default function LocationSelector({
  label,
  onSelectLocation,
  onCurrentLocation,
  externalLocation,
}: {
  label: string;
  onSelectLocation: (coords: MapCoordinates, address: string) => void;
  iconColor: string;
  onCurrentLocation: () => void
  value?: string
  externalLocation?: {
    lat: number;
    lng: number;
    address: string;
  } | null;
}) {
  return (
    <View style={{ paddingHorizontal: 10, paddingTop: 20 }}>
      <Text style={{ fontSize: 12, color: "#ffffff", marginBottom: 4 }}>{label}</Text>


      <View style={{ position: "relative", width: "100%" }}>
        {/* Search Input */}
        <OlaSearchInput
          placeholder={`Search ${label.toLowerCase()} or press location button`}
          onSelect={(data: any) => {
            onSelectLocation(
              { lat: data.lat, lng: data.lng },
              data.address
            );
          }}
          externalSetLocation={externalLocation}
        />

        {/* Inline Button (inside the input) */}
        <TouchableOpacity
          onPress={onCurrentLocation}
          style={{
            position: "absolute",
            right: 10,
            top: "42%",
            transform: [{ translateY: -12 }],
            backgroundColor: "#16a34a",
            padding: 6,
            borderRadius: 5,
          }}
        >
          <Ionicons name="locate" size={18} color="white" />
        </TouchableOpacity>

      </View>
    </View >
  );
}

