
import React from "react";
import { View, Text } from "react-native";
import { MapCoordinates } from "@/services/olaMapsService";
import OlaSearchInput from "./olaSearchInput";

export default function LocationSelector({
  label,
  onSelectLocation,
}: {
  label: string;
  onSelectLocation: (coords: MapCoordinates, address: string) => void;
  iconColor: string;
  value?: string
}) {
  return (
    <View style={{ paddingHorizontal: 10, paddingTop: 20 }}>
      <Text style={{ fontSize: 12, color: "#ffffff", marginBottom: 4 }}>{label}</Text>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
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

