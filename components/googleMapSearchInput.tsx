
import React from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { View } from "react-native";

export default function GoogleMapSearchInput({
  placeholder,
  onSelect,
}: {
  placeholder: string;
  onSelect: (data: any) => void;
}) {
  return (
    <View style={{ flex: 1 }}>
      <GooglePlacesAutocomplete
        placeholder={placeholder}
        fetchDetails={true}
        onPress={(data, details = null) => {
          if (!details) return;

          const location = details.geometry.location;

          onSelect({
            lat: location.lat,
            lng: location.lng,
            address: details.formatted_address,
            place_id: data.place_id,
          });
        }}
        query={{
          key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
          language: "en",
        }}
        styles={{
          textInput: {
            height: 42,
            fontSize: 14,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            paddingHorizontal: 10,
          },
        }}
      />
    </View>
  );
}
