
import { GeocodeResult, isWithinServiceArea } from "@/services/geocode";
import olaMapsService from "@/services/olaMapsService";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";

export default function OlaSearchInput({
  placeholder,
  onCurrentLocation,
  onSelect,
  externalLocation,
}: {
  placeholder: string;
  onSelect: (location: { lat: number; lng: number; address: string; }) => void;
  onCurrentLocation: () => void;
  externalLocation?: { lat: number; lng: number; address: string; } | null;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSelected, setIsSelected] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  /* ---------------------- External Location Handler ---------------------- */
  useEffect(() => {
    if (!externalLocation) return;

    const { address } = externalLocation;
    setQuery(address);
    setIsSelected(false);

    const searchExternal = async () => {
      setLoading(true);
      setError(null);
      setResults([]);

      try {
        const data = await olaMapsService.geocode(address);
        if (!data?.success || data.results.length === 0) {
          setError("Location not found");
          return;
        }

        const match = data.results[0];
        const withinService = isWithinServiceArea(match.lat, match.lng);
        if (!withinService) {
          setError("Service isn't available in this area");
          return;
        }

        onSelect({
          lat: match.lat,
          lng: match.lng,
          address: match.display_name,
        });

        setQuery(match.display_name);
        setIsSelected(true);
      } catch (err) {
        console.error("External geocode failed:", err);
        setError("Failed to fetch location.");
      } finally {
        setLoading(false);
      }
    };

    searchExternal();
  }, [externalLocation]);

  /* ---------------------------- Search Handler ---------------------------- */
  useEffect(() => {
    if (isSelected) return;
    if (!query || query.length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await olaMapsService.geocode(query);
        if (data?.success) {
          setResults(data.results);
        } else {
          setResults([]);
          setError("No results found.");
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Geocode search failed:", err);
          setError("Failed to fetch results. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, isSelected]);

  /* ----------------------------- Selection ----------------------------- */
  const handleSelect = (item: GeocodeResult) => {
    setIsSelected(true);
    const withinService = isWithinServiceArea(item.lat, item.lng);

    if (!withinService) return setError("Service isn't available in this area");

    onSelect({
      lat: item.lat,
      lng: item.lng,
      address: item.display_name,
    });

    setQuery(item.display_name);
    setResults([]);
  };

  /* ----------------------------- UI Layout ----------------------------- */
  return (
    <View style={{ width: "100%" }}>
      {/* Input Wrapper */}
      <View
        style={{
          position: "relative",
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "white",
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 12,
          paddingRight: 45,
          paddingLeft: 12,
        }}
      >
        <TextInput
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            setIsSelected(false);
          }}
          placeholder={placeholder}
          placeholderTextColor="#999"
          style={{
            flex: 1,
            paddingVertical: 12,
            fontSize: 15,
          }}
        />

        {/* Current Location Button */}
        <TouchableOpacity
          onPress={onCurrentLocation}
          style={{
            position: "absolute",
            right: 8,
            backgroundColor: "#16a34a",
            padding: 7,
            borderRadius: 8,
          }}
        >
          <Ionicons name="locate" size={18} color="white" />
        </TouchableOpacity>
      </View>

      {/* Loader */}
      {loading && (
        <View style={{ paddingVertical: 10, alignItems: "center" }}>
          <ActivityIndicator size="small" color="#16a34a" />
        </View>
      )}

      {/* Error */}
      {error && (
        <View style={{ paddingVertical: 6 }}>
          <Text style={{ color: "red", fontSize: 12 }}>{error}</Text>
        </View>
      )}

      {/* Results Dropdown */}
      {results.length > 0 && !loading && (
        <ScrollView
          style={{
            maxHeight: 220,
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 12,
            marginTop: 6,
            overflow: "hidden",
          }}
          nestedScrollEnabled
        >
          {results.map((item) => {
            const withinService = isWithinServiceArea(item.lat, item.lng);

            return (
              <TouchableOpacity
                key={item.place_id}
                onPress={() => handleSelect(item)}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: "#eee",
                  backgroundColor: withinService ? "white" : "#ffe6e6",
                }}
              >
                <Text
                  style={{
                    fontWeight: "500",
                    fontSize: 14,
                    color: withinService ? "#000" : "#b30000",
                  }}
                >
                  {item.display_name}
                </Text>

                {!withinService && (
                  <Text style={{ fontSize: 10, color: "#b30000", marginTop: 2 }}>
                    Outside service area
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

