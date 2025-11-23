
import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";

export default function RideTypeSelector({
  selectedRideType,
  setSelectedRideType,
  fareSolo,
  fareShared,
  scheduledDate,
  scheduledTime,
  setScheduledDate,
  setScheduledTime,
}: any) {
  const Tab = ({
    type,
    title,
    subtitle,
    price,
  }: {
    type: string;
    title: string;
    subtitle: string;
    price: string;
  }) => (
    <TouchableOpacity
      onPress={() => setSelectedRideType(type)}
      style={{
        borderWidth: 1,
        borderColor: selectedRideType === type ? "#16a34a" : "#ddd",
        backgroundColor: selectedRideType === type ? "#dcfce7" : "#fff",
        padding: 12,
        borderRadius: 12,
        marginBottom: 10,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View>
          <Text style={{ fontWeight: "600" }}>{title}</Text>
          <Text style={{ fontSize: 12, color: "#555" }}>{subtitle}</Text>
        </View>
        <Text style={{ fontWeight: "700" }}>{price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>
        Choose Ride Type
      </Text>

      <Tab
        type="private"
        title="Solo"
        subtitle={fareSolo?.duration || "-"}
        price={fareSolo ? `₹${fareSolo.fare}` : "—"}
      />

      <Tab
        type="shared"
        title="Shared"
        subtitle={fareShared?.duration || "-"}
        price={fareShared ? `₹${fareShared.fare}` : "—"}
      />

      {/* Scheduled */}
      <TouchableOpacity
        onPress={() => setSelectedRideType("scheduled")}
        style={{
          borderWidth: 1,
          borderColor: selectedRideType === "scheduled" ? "#16a34a" : "#ddd",
          backgroundColor: selectedRideType === "scheduled" ? "#dcfce7" : "#fff",
          padding: 12,
          borderRadius: 12,
          marginBottom: 10,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text style={{ fontWeight: "600" }}>Schedule</Text>
            <Text style={{ fontSize: 12, color: "#555" }}>Book for later</Text>
          </View>
          <Text style={{ fontWeight: "700" }}>{fareSolo ? `₹${fareSolo.fare}` : "—"}</Text>
        </View>

        {selectedRideType === "scheduled" && (
          <View style={{ marginTop: 10 }}>
            <TextInput
              value={scheduledDate}
              onChangeText={setScheduledDate}
              placeholder="YYYY-MM-DD"
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 10,
                borderRadius: 10,
                marginBottom: 8,
              }}
            />
            <TextInput
              value={scheduledTime}
              onChangeText={setScheduledTime}
              placeholder="HH:MM"
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 10,
                borderRadius: 10,
              }}
            />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
