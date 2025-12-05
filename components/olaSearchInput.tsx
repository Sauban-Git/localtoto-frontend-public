
import { GeocodeResult, isWithinServiceArea } from "@/services/geocode";
import olaMapsService from "@/services/olaMapsService";
import React, { useEffect, useRef, useState } from "react";
import { View, TextInput, TouchableOpacity, Text, ScrollView, ActivityIndicator } from "react-native";

export default function OlaSearchInput({
  placeholder,
  onSelect,
  externalSetLocation,
}: {
  placeholder: string;
  onSelect: (location: {
    lat: number;
    lng: number;
    address: string;
  }) => void;

  externalSetLocation?: {
    lat: number;
    lng: number;
    address: string;
  } | null;


}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSelected, setIsSelected] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!externalSetLocation) return;

    const { address } = externalSetLocation;

    setQuery(address);        // update input field text
    setIsSelected(false);     // allow search to run

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

        // auto-select because it is valid
        onSelect({
          lat: match.lat,
          lng: match.lng,
          address: match.display_name,
        });

        setQuery(match.display_name);
        setIsSelected(true);
        setResults([]);

      } catch (err) {
        console.error("External geocode failed:", err);
        setError("Failed to fetch location.");
      } finally {
        setLoading(false);
      }
    };

    searchExternal();
  }, [externalSetLocation]);


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
        if (err.name === "AbortError") return; // request cancelled
        console.error("Geocode search failed:", err);
        setResults([]);
        setError("Failed to fetch results. Please try again.");
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

  const handleSelect = (item: GeocodeResult) => {
    setIsSelected(true)
    const withinService = isWithinServiceArea(item.lat, item.lng);
    if (!withinService) return setError("Service isn't available in this area")
    onSelect({
      lat: item.lat,
      lng: item.lng,
      address: item.display_name,
    });
    setQuery(item.display_name);
    setResults([]);
  };

  return (
    <View style={{ width: "100%" }}>
      <TextInput
        value={query}
        onChangeText={(text) => {
          setQuery(text)
          setIsSelected(false)
        }}
        placeholder={placeholder}
        placeholderTextColor="#999"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          borderRadius: 10,
          backgroundColor: "white",
          width: "100%",
        }}
      />

      {loading && (
        <View style={{ padding: 12, flexDirection: "row", justifyContent: "center" }}>
          <ActivityIndicator size="small" color="#16a34a" />
        </View>
      )}

      {error && (
        <View style={{ padding: 12 }}>
          <Text style={{ color: "red", fontSize: 12 }}>{error}</Text>
        </View>
      )}

      {results.length > 0 && !loading && (
        <ScrollView
          style={{
            maxHeight: 200,
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: "#ccc",
            marginTop: 4,
            borderRadius: 10,
          }}
          nestedScrollEnabled
        >
          {results.map(item => {
            const withinService = isWithinServiceArea(item.lat, item.lng);
            return (
              <TouchableOpacity
                key={item.place_id}
                onPress={() => handleSelect(item)}
                style={{
                  padding: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: "#eee",
                  backgroundColor: withinService ? "white" : "#ffe6e6",
                }}
              >
                <Text style={{ fontWeight: "500", color: withinService ? "#000" : "#b30000" }}>
                  {item.display_name}
                </Text>
                {!withinService && (
                  <Text style={{ fontSize: 10, color: "#b30000" }}>Outside service area</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

