
import { useState } from "react";
import { Image, Modal, ScrollView, Text, TouchableOpacity, View, StyleSheet } from "react-native"
import { useRouter, Slot } from "expo-router";
import { useColors } from "@/hooks/useColors";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AdminLayout: React.FC = () => {
  const c = useColors();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("adminAccess");
      await AsyncStorage.removeItem("adminRefresh");
      await AsyncStorage.removeItem("adminPhone");
    } catch { }
    router.replace("/(admin)/adminLogin");
  };

  const menuItems = [
    { to: ".", label: "Dashboard" },
    { to: "rides", label: "Rides" },
    { to: "users", label: "Users" },
    { to: "drivers", label: "Drivers" },
    { to: "driver-requests", label: "Driver Requests" },
    { to: "contact-messages", label: "Contact Messages" },
    { to: "settings", label: "Settings" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>

      {/* HEADER */}
      <View style={[styles.header, { borderBottomColor: c.card }]}>
        <TouchableOpacity onPress={() => setMobileOpen(true)} style={styles.menuButton}>
          <Text style={[styles.menuIcon, { color: c.link }]}>☰</Text>
        </TouchableOpacity>

        <View style={styles.logoRow}>
          <Image source={require("../assets/full_logo.png")} style={styles.logo} />
          <Text style={[styles.title, { color: c.primary }]}>Admin</Text>
        </View>

        <TouchableOpacity onPress={handleLogout} style={[styles.logoutBtn, { backgroundColor: c.primary }]}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* SIDEBAR MODAL */}
      <Modal visible={mobileOpen} transparent animationType="slide">
        <TouchableOpacity style={styles.overlay} onPress={() => setMobileOpen(false)} />

        <View style={[styles.sidebar, { backgroundColor: c.background, borderRightColor: c.card }]}>
          <View style={styles.sidebarHeader}>
            <Text style={[styles.sidebarTitle, { color: c.primary }]}>Admin</Text>

            <TouchableOpacity onPress={() => setMobileOpen(false)}>
              <Text style={[styles.closeBtn, { color: c.link }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.menuScroll}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.to}
                style={styles.menuItem}
                onPress={() => {
                  setMobileOpen(false);
                  // router.push(`/(admin)/${item.to}`);
                }}
              >
                <Text style={[styles.menuText, { color: c.link }]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* EXPO ROUTER OUTLET REPLACEMENT */}
      <View style={styles.content}>
        <Slot />
      </View>
    </View>
  );
};

export default AdminLayout;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    height: 60,
    flexDirection: "row",
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
  },

  menuButton: {
    padding: 8,
  },

  menuIcon: {
    fontSize: 28,
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    height: 32,
    width: 32,
    resizeMode: "contain",
    marginRight: 6,
  },

  title: {
    fontSize: 20,
    fontWeight: "600",
  },

  logoutBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },

  logoutText: {
    color: "white",
    fontWeight: "600",
  },

  overlay: {
    position: "absolute",
    top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  sidebar: {
    width: 260,
    height: "100%",
    borderRightWidth: 1,
    paddingTop: 20,
  },

  sidebarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },

  sidebarTitle: {
    fontSize: 22,
    fontWeight: "700",
  },

  closeBtn: {
    fontSize: 26,
  },

  menuScroll: {
    paddingHorizontal: 16,
  },

  menuItem: {
    paddingVertical: 14,
    borderRadius: 6,
  },

  menuText: {
    fontSize: 16,
  },

  content: {
    flex: 1,
    padding: 16,
  },
});
