
import { GeocodeResult, isWithinServiceArea } from "@/services/geocode";
import olaMapsService from "@/services/olaMapsService";
import React, { useEffect, useRef, useState } from "react";
import { View, TextInput, TouchableOpacity, Text, ScrollView, ActivityIndicator } from "react-native";

export default function OlaSearchInput({
  placeholder,
  onSelect,
}: {
  placeholder: string;
  onSelect: (location: {
    lat: number;
    lng: number;
    address: string;
  }) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
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
  }, [query]);

  const handleSelect = (item: GeocodeResult) => {
    const withinService = isWithinServiceArea(item.lat, item.lng);
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
        onChangeText={setQuery}
        placeholder={placeholder}
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

