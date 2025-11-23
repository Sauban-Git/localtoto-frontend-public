
import MapView from "react-native-maps";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import useFareEstimator from "@/hooks/useFareEstimator";
import useOtpVerification from "@/hooks/useOtpVerification";
import AnimatedBackground from "@/components/animatedBackground";
import PhoneVerificationCard from "@/components/phoneVerification";
import LocationSelector from "@/components/locationSelector";
import RideTypeSelector from "@/components/rideTypeSelector";
import { MapCoordinates } from "@/services/olaMapsService";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const { height } = Dimensions.get("window");

const SNAP_TOP = height * 0.15; // top snap (expanded)
const SNAP_MID = height * 0.45; // mid
const SNAP_BOTTOM = height - 250; // collapsed

const BookingDetailsPage = () => {
  const router = useRouter();

  const otpHook = useOtpVerification();

  const [pickupCoords, setPickup] = useState<MapCoordinates>({ lat: 0, lng: 0 });
  const [dropCoords, setDrop] = useState<MapCoordinates>({ lat: 0, lng: 0 });
  const [selecting, setSelecting] = useState<"pickup" | "drop" | null>(null);
  const mapRef = React.useRef<MapView>(null);

  const [selectedRideType, setSelectedRideType] = useState<
    "private" | "shared" | "scheduled"
  >("private");

  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const { fareSolo, fareShared } = useFareEstimator(pickupCoords, dropCoords);

  const handleConfirmBooking = () => {
    if (!otpHook.isAuthenticated) {
      alert("Please verify your phone first!");
      return;
    }

    if (!pickupCoords || !dropCoords) {
      alert("Please select pickup and drop locations!");
      return;
    }

    router.push({
      pathname: "/(booking)/bookingConfirmationPage",
      params: {
        pickupCoords: JSON.stringify(pickupCoords),
        dropCoords: JSON.stringify(dropCoords),
        rideType: selectedRideType,
        scheduledDate,
        scheduledTime,
        fare:
          selectedRideType === "private"
            ? fareSolo?.fare
            : selectedRideType === "shared"
              ? fareShared?.fare
              : fareSolo?.fare,
      },
    });
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
        Math.max(newY, SNAP_TOP),
        SNAP_BOTTOM
      );
    })
    .onEnd(() => {
      if (translateY.value < SNAP_MID) {
        translateY.value = withSpring(SNAP_TOP);
      } else if (translateY.value < SNAP_BOTTOM - 100) {
        translateY.value = withSpring(SNAP_MID);
      } else {
        translateY.value = withSpring(SNAP_BOTTOM);
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });

  return (
    <View style={{ flex: 1 }}>
      {/* MAP */}
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        onRegionChangeComplete={(region) => {
          setMapCenter({
            lat: region.latitude,
            lng: region.longitude,
          });
        }}
      />

      {/* Center Pin */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          marginLeft: -12,
          marginTop: -24,
          zIndex: 10,
        }}
      >
        <Text style={{ fontSize: 30 }}>📍</Text>
      </View>

      {/* BOTTOM SHEET */}
      <Animated.View
        style={[
          sheetStyle,
          {
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: height * 0.9,
            backgroundColor: "white",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            overflow: "hidden",
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
          {!otpHook.isAuthenticated && <PhoneVerificationCard />}

          <LocationSelector
            label="Pickup"
            value={pickupCoords}
            onChange={setPickup}
            onConfirm={() => {
              setSelecting("pickup");
              alert("Tap on the map to set pickup location");
            }}
            iconColor="#16a34a"
          />

          <LocationSelector
            label="Drop"
            value={dropCoords}
            onChange={setDrop}
            onConfirm={() => {
              setSelecting("drop");
              alert("Tap on the map to set drop location");
            }}
            iconColor="#2563eb"
          />

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
        </Animated.ScrollView>
      </Animated.View>
    </View>
  );
};

export default BookingDetailsPage;

