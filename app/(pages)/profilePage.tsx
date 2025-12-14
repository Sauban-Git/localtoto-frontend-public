
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/services/api";

const ProfilePage = () => {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bookings, setBookings] = useState<any[]>([]);

  // -------------------- Load Profile --------------------
  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        return;
      }

      try {
        const res = await api.get("/users/profile");
        setUser(res.data?.user);
        setAvatarUrl(res.data?.user?.profilePhoto?.url || "");
      } catch (e: any) {
        if (e?.response?.status === 401) {
          return;
        }
        Alert.alert("Error", e?.response?.data?.message || "Failed to load profile");
      }
    })();
  }, []);

  // -------------------- Pick Image --------------------
  const handleOpenFilePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    const uri = asset.uri;

    const blob = await (await fetch(uri)).blob();

    if (blob.size > 3 * 1024 * 1024) {
      Alert.alert("Error", "Image must be less than 3MB.");
      return;
    }

    const form = new FormData();
    form.append("profilePhoto", {
      uri,
      type: blob.type || "image/jpeg",
      name: "photo.jpg",
    } as any);

    try {
      const res = await api.post("/users/profile/photo", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const url = res.data?.profilePhoto?.url;
      if (url) {
        setAvatarUrl(`${url}?t=${Date.now()}`);
        setUser((prev: any) => (prev ? { ...prev, profilePhoto: { url } } : prev));
      }
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.message || "Failed to upload photo");
    }
  };

  // -------------------- Load Ride History --------------------
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/bookings/history");
        setBookings(res.data?.bookings || []);
      } catch { }
    })();
  }, []);

  // -------------------- Render --------------------
  return (
    <ScrollView style={styles.container}>
      {/* Profile Card */}
      <View style={styles.card}>
        <View style={styles.center}>
          <Image
            source={{ uri: avatarUrl || "https://via.placeholder.com/200" }}
            style={styles.avatar}
          />

          <TouchableOpacity onPress={handleOpenFilePicker} style={styles.changePhotoBtn}>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>

          <Text style={styles.nameText}>
            {user ? `${user.firstName} ${user.lastName}` : ""}
          </Text>

          {/* Info boxes */}
          <View style={{ width: "100%", marginTop: 16 }}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email || "-"}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{user?.phoneNumber || "-"}</Text>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.editBtn}>
              <Text style={styles.editBtnText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={async () => {
                await AsyncStorage.removeItem("token");
                await AsyncStorage.removeItem("refreshToken");
                // router.replace("/signin");
              }}
            >
              <Text style={styles.logoutBtnText}>Log out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Recent Rides */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Recent Rides</Text>

        {bookings.slice(0, 3).map((b) => (
          <View key={b.id} style={styles.rideRow}>
            <View>
              <Text style={styles.rideTitle}>
                {b.pickup_description} → {b.dropoff_description}
              </Text>
              <Text style={styles.rideSub}>
                {b.status} • ₹{b.fare}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() =>
                // router.push({
                //   pathname: "/booking-confirmation",
                //   params: {
                //     rideId: b.id,
                //     pickupAddress: b.pickup_description,
                //     dropAddress: b.dropoff_description,
                //     pickupCoords: JSON.stringify({
                //       lat: b.pickup_lat,
                //       lng: b.pickup_lng,
                //     }),
                //     dropCoords: JSON.stringify({
                //       lat: b.dropoff_lat,
                //       lng: b.dropoff_lng,
                //     }),
                //     fare: b.fare,
                //     distance: b.distance_km,
                //     duration: b.duration_text,
                //   },
                // })
                console.log(" ")
              }
            >
              <Text style={styles.viewText}>View</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Full Ride History */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Ride History</Text>

        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          renderItem={({ item: b }) => (
            <TouchableOpacity
              style={styles.historyRow}
              onPress={() =>
                // router.push({
                //   pathname: "/booking-confirmation",
                //   params: {
                //     rideId: b.id,
                //     pickupAddress: b.pickup_description,
                //     dropAddress: b.dropoff_description,
                //     pickupCoords: JSON.stringify({
                //       lat: b.pickup_lat,
                //       lng: b.pickup_lng,
                //     }),
                //     dropCoords: JSON.stringify({
                //       lat: b.dropoff_lat,
                //       lng: b.dropoff_lng,
                //     }),
                //     fare: b.fare,
                //     distance: b.distance_km,
                //     duration: b.duration_text,
                //   },
                // })
                console.log("")
              }
            >
              <Text style={styles.rideTitle}>
                {b.pickup_description} → {b.dropoff_description}
              </Text>
              <Text style={styles.rideSub}>
                {new Date(b.created_at).toLocaleDateString()} • ₹{b.fare}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </ScrollView>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    padding: 16,
    paddingTop: 60,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  center: {
    alignItems: "center",
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 999,
  },
  changePhotoBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 10,
  },
  changePhotoText: {
    color: "#444",
  },
  nameText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  infoLabel: { color: "#555" },
  infoValue: { fontWeight: "500", color: "#222" },
  btnRow: {
    flexDirection: "row",
    marginTop: 16,
    gap: 8,
  },
  editBtn: {
    backgroundColor: "#16A34A",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  editBtnText: { color: "#fff", fontWeight: "600" },
  logoutBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  logoutBtnText: { color: "#444" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  rideRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  rideTitle: { fontWeight: "600", color: "#222" },
  rideSub: { color: "#777", marginTop: 2 },
  viewText: { color: "#15803D", fontWeight: "600" },
  historyRow: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
});

