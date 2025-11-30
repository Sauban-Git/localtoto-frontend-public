
import * as IntentLauncher from "expo-intent-launcher";
import * as Location from "expo-location"
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from "react-native-maps";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import useFareEstimator from "@/hooks/useFareEstimator";
import useOtpVerification from "@/hooks/useOtpVerification";
import AnimatedBackground from "@/components/animatedBackground";
import PhoneVerificationCard from "@/components/phoneVerification";
import LocationSelector from "@/components/locationSelector";
import RideTypeSelector from "@/components/rideTypeSelector";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import olaMapsService, { MapCoordinates } from "@/services/olaMapsService";
import { useRideStore } from "@/stores/bookingConfirmStore";

type LocationState = Location.LocationObject | null;

const { height } = Dimensions.get("window");

const SNAP_TOP = height * 0.15; // top snap (expanded)
const SNAP_MID = height * 0.45; // mid
const SNAP_BOTTOM = height - 250; // collapsed

const BookingDetailsPage = () => {
  const router = useRouter();

  const otpHook = useOtpVerification();

  const [pickupCoords, setPickup] = useState<MapCoordinates | null>(null);
  const [markerCoords, setMarkerCoords] = useState<MapCoordinates | null>(null);
  const [pickupAddress, setPickupAddress] = useState<string>("");
  const [dropCoords, setDrop] = useState<MapCoordinates | null>(null);
  const [dropAddress, setDropAddress] = useState<string>("")
  const mapRef = React.useRef<MapView>(null);

  const [selectedRideType, setSelectedRideType] = useState<
    "private" | "shared" | "scheduled"
  >("private");

  const setRideData = useRideStore((state) => state.setConfirmationData);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const { fareSolo, fareShared } = useFareEstimator(pickupCoords, dropCoords)

  const handleConfirmBooking = async () => {

    if (!pickupCoords || !dropCoords) {
      alert("Please select pickup and drop locations!");
      return;
    }
    const routeData = await olaMapsService.getRoute(pickupCoords, dropCoords)

    const bookingConfirmationData: ConfirmationState = {
      pickupCoords,
      dropCoords,
      rideType: selectedRideType,
      scheduledDate,
      pickupAddress,
      dropAddress,
      scheduledTime,
      routeData,
      fare:
        selectedRideType === "private"
          ? fareSolo?.fare
          : selectedRideType === "shared"
            ? fareShared?.fare
            : fareSolo?.fare,
    }

    setRideData(bookingConfirmationData);

    router.push("/(riding)/ridingInitiate")
  };

  // Bottom sheet animation states
  const startY = useSharedValue(0);
  const translateY = useSharedValue(SNAP_BOTTOM);
  const scrollY = useSharedValue(0);
  const isScrolling = useSharedValue(false);

  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: () => {
      isScrolling.value = true;
    },
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
    onEndDrag: () => {
      isScrolling.value = false;
    },
  });

  // Drag gesture logic
  const dragGesture = Gesture.Pan()
    .onStart(() => {
      startY.value = translateY.value;
    })
    .onUpdate((e) => {
      const newY = startY.value + e.translationY;
      translateY.value = Math.min(
        Math.max(newY, SNAP_MID),
        SNAP_BOTTOM
      );
    })
    .onEnd(() => {
      if (translateY.value < (SNAP_MID + SNAP_BOTTOM) / 2) {
        translateY.value = withSpring(SNAP_MID);
      } else {
        translateY.value = withSpring(SNAP_BOTTOM);
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const [location, setLocation] = useState<LocationState>(null)

  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
          console.log("Permission denied..")
          return
        }
        const servicesEnabled = await Location.hasServicesEnabledAsync();
        if (!servicesEnabled) {
          console.log("Location services are OFF");
          alert("Please enable your device's GPS / Location Services.");
          IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.LOCATION_SOURCE_SETTINGS);
          return;
        }
        const location = await Location.getCurrentPositionAsync({})
        setLocation(location)
      } catch (error) {
        console.log("Error while getting location ", error)
      }
    }
    getLocation()
  }, [])


  useEffect(() => {
    if (location) {
      // Once the location is fetched, center the map on it
      const { latitude, longitude } = location.coords;

      // Animate the map to the user's current location
      if (mapRef.current) {
        mapRef.current.animateCamera({
          center: { latitude, longitude },
          zoom: 15, // Adjust zoom level as necessary
          pitch: 0,
          heading: 0,
          altitude: 0
        });
      }
    }
  }, [location]); // This will run when location is updated

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarkerCoords({ lat: latitude, lng: longitude });
    // Optionally center the map at the tapped location
    console.log("Pickup: lat: ", latitude, "lng: ", longitude)
    mapRef.current?.animateCamera({
      center: { latitude, longitude },
      zoom: 15,
    });
  };

  // Set Pickup to Marked Location
  const handleUseCurrentLocation = async () => {
    setPickup(markerCoords);
    mapRef.current?.animateCamera({
      center: { latitude: markerCoords!.lat, longitude: markerCoords!.lng },
      zoom: 15,
    });
    try {
      const data = await olaMapsService.reverseGeocode(markerCoords!.lat, markerCoords!.lng);
      if (data?.success) {
        setPickupAddress(data.address);
      } else {
        console.log("error while setting result")
      }
    } catch (err: any) {
      if (err.name === "AbortError") return; // request cancelled
      console.log("Geocode search failed:", err);
    } finally {
      console.log("finallyyyyy")
    }

  };

  // Set Drop using Marker
  const handleSetDropLocation = async () => {
    setDrop(markerCoords);
    if (!markerCoords?.lat || !markerCoords.lat) return
    mapRef.current?.animateCamera({
      center: { latitude: markerCoords?.lat, longitude: markerCoords?.lng },
      zoom: 15,
    });
    try {
      const data = await olaMapsService.reverseGeocode(markerCoords.lat, markerCoords.lng);
      if (data?.success) {
        setDropAddress(data.address);
      } else {
        console.log("error while setting result")
      }
    } catch (err: any) {
      if (err.name === "AbortError") return; // request cancelled
      console.log("Geocode search failed:", err);
    } finally {
      console.log("finallyyyyy")
    }
  }

  return (
    <View style={{ flex: 1 }}>

      <View style={{ flex: 1, zIndex: 1 }}>
        <MapView
          ref={mapRef} // Pass the map reference
          style={{ flex: 1 }}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true} // Shows the user's location marker on the map
          followsUserLocation={true} // Follows user's location automatically
          onPress={(e) => handleMapPress(e)}
        >
          {/* Center pin, it will be moved to the current location */}
          {location && (
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="You are here"
              description="This is your current location"
            />
          )}

          {markerCoords !== null && markerCoords.lat !== null && markerCoords.lng !== null && (
            <Marker coordinate={{ latitude: markerCoords.lat, longitude: markerCoords.lng }} title="Pickup Location" pinColor="red" />
          )}

          {/* Marker for pickup */}
          {pickupCoords !== null && pickupCoords.lat !== null && pickupCoords.lng !== null && (
            <Marker coordinate={{ latitude: pickupCoords.lat, longitude: pickupCoords.lng }} title="Pickup Location" pinColor="green" />
          )}

          {/* Marker for drop */}
          {dropCoords !== null && dropCoords.lat !== 0 && dropCoords.lng !== 0 && (
            <Marker coordinate={{ latitude: dropCoords.lat, longitude: dropCoords.lng }} title="Drop Location" pinColor="blue" />
          )}
        </MapView>
      </View>
      {/* BOTTOM SHEET */}
      <Animated.View
        style={[
          sheetStyle,
          {
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 20,
            height: height * 0.9,
            backgroundColor: "white",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            overflow: "hidden",
            zIndex: 10
          },
        ]}
      >
        <AnimatedBackground />

        <GestureDetector gesture={dragGesture}>
          {/* Handle Bar */}
          <TouchableOpacity
            onPress={() => {
              translateY.value = withSpring(SNAP_TOP);
            }}
            activeOpacity={0.7}
            style={{
              width: 160,
              height: 10,
              backgroundColor: "#ccc",
              borderRadius: 3,
              alignSelf: "center",
              marginTop: 10,
              marginBottom: 10,
            }}
          />

        </GestureDetector>
        {/* SCROLLABLE CONTENT */}
        <Animated.ScrollView
          nestedScrollEnabled
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          contentContainerStyle={{
            padding: 20,
            paddingBottom: 200,
          }}
        >
          {!otpHook.isAuthenticated ? (<PhoneVerificationCard />) :
            !pickupCoords ?
              (<><LocationSelector
                label="Pickup"
                iconColor="#16a34a"
                value={pickupAddress}
                onSelectLocation={(coords, address) => {
                  setPickup(coords);
                  setPickupAddress(address)


                  // Center map to selected location
                  mapRef.current?.animateCamera({
                    center: { latitude: coords.lat, longitude: coords.lng },
                    zoom: 15,
                  });
                }}
              />
                <TouchableOpacity
                  onPress={handleUseCurrentLocation}
                  style={{
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    backgroundColor: "#4caf50",
                    borderRadius: 8,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                  }}
                >
                  <Text style={{ color: "white", fontSize: 14, fontWeight: "600" }}>
                    Use Current Location
                  </Text>
                </TouchableOpacity>
              </>) :
              !dropCoords ?
                (<>
                  <LocationSelector
                    label="Drop"
                    value={dropAddress}
                    iconColor="#2563eb"
                    onSelectLocation={(coords, address) => {
                      setDrop(coords);
                      setDropAddress(address)
                      mapRef.current?.animateCamera({
                        center: { latitude: coords.lat, longitude: coords.lng },
                        zoom: 15,
                      });
                    }}
                  />

                  <TouchableOpacity
                    onPress={handleSetDropLocation}
                    style={{
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      backgroundColor: "#2563eb",
                      borderRadius: 8,
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 20,
                    }}
                  >
                    <Text style={{ color: "white" }}>Use Marker to Set Drop</Text>
                  </TouchableOpacity>
                </>
                ) : (
                  <>
                    <RideTypeSelector
                      selectedRideType={selectedRideType}
                      setSelectedRideType={setSelectedRideType}
                      fareSolo={fareSolo}
                      fareShared={fareShared}
                      scheduledDate={scheduledDate}
                      scheduledTime={scheduledTime}
                      setScheduledDate={setScheduledDate}
                      setScheduledTime={setScheduledTime}
                    />

                    <TouchableOpacity
                      onPress={handleConfirmBooking}
                      style={{
                        marginTop: 20,
                        backgroundColor: "#16a34a",
                        padding: 16,
                        borderRadius: 12,
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>
                        Confirm Booking
                      </Text>
                    </TouchableOpacity>
                  </>
                )

          }



        </Animated.ScrollView>
      </Animated.View>
    </View>
  );
};

export default BookingDetailsPage;

