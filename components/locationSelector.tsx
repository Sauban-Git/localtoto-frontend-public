
import { MapCoordinates } from "@/services/olaMapsService";
import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

export default function LocationSelector({
  label,
  value,
  onChange,
  onConfirm,
  iconColor,
}: {
  label: string;
  value: MapCoordinates;
  onChange: (v: string) => void;
  onConfirm: () => void;
  iconColor: string;
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
            marginTop: 4,
          }}
        />

        <TextInput
          value={String(value)}
          onChangeText={onChange}
          placeholder={`Search ${label.toLowerCase()}`}
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 12,
            borderRadius: 10,
          }}
        />
      </View>

      <TouchableOpacity
        onPress={onConfirm}
        style={{
          alignSelf: "flex-end",
          marginTop: 6,
          backgroundColor: "#16a34a",
          paddingVertical: 6,
          paddingHorizontal: 14,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "white", fontWeight: "600", fontSize: 12 }}>
          Use this location
        </Text>
      </TouchableOpacity>
    </View>
  );
}
