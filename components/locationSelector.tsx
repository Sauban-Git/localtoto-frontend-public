
import React from "react";
import { View, Text } from "react-native";
import { MapCoordinates } from "@/services/olaMapsService";
import OlaSearchInput from "./olaSearchInput";

export default function LocationSelector({
  label,
  onSelectLocation,
  iconColor,
  value,
}: {
  label: string;
  onSelectLocation: (coords: MapCoordinates, address: string) => void;
  iconColor: string;
  value?: string
}) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>{label}</Text>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 10,
            backgroundColor: iconColor,
            marginRight: 8,
          }}
        />

        <View style={{ flex: 1 }}>
          <OlaSearchInput
            // value={value}
            placeholder={`Search ${label.toLowerCase()}`}
            onSelect={(data: any) => {
              onSelectLocation(
                { lat: data.lat, lng: data.lng },
                data.address
              );
            }}
          />
        </View>
      </View>
    </View>
  );
}

