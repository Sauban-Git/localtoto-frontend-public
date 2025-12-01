
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { usePathname } from "expo-router";
import { isAllowedAdmin } from "@/config/adminConfig";
import { MaterialIcons } from "@expo/vector-icons";
import { Options } from "./options";
import AnimatedBackground from "./animatedBackground";

const NavBar = () => {
  const currentPath = usePathname();

  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const toggleOptions = () => setIsOptionsOpen(prev => !prev);
  const closeOptions = () => setIsOptionsOpen(false);

  const [isScrolled, setIsScrolled] = useState(false);
  const [canSeeAdmin, setCanSeeAdmin] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  // Load user/admin info from AsyncStorage
  useEffect(() => {
    const checkUser = async () => {
      const adminPhone = await AsyncStorage.getItem("adminPhone");
      const token = await AsyncStorage.getItem("token");
      setCanSeeAdmin(isAllowedAdmin(adminPhone ?? undefined));
      setIsUserLoggedIn(!!token);
    };
    checkUser();
  }, []);

  const isRideFlowPage =
    currentPath === "/ride-initiate" || currentPath === "/booking-details";
  const isHomePage = currentPath === "/";
  const isSolid = isScrolled || !isHomePage;


  return (<>
    <AnimatedBackground />
    <View style={[styles.navbar, isSolid && styles.navbarSolid]}>

      <Image source={require("@/assets/images/full_logo.png")} style={{ width: 100, height: 30, resizeMode: "contain" }} />

      <TouchableOpacity onPress={toggleOptions} style={{ marginRight: 16 }}>
        {isOptionsOpen ? (
          <MaterialIcons name="close" size={28} />
        ) : (
          <MaterialIcons name="menu" size={28} />
        )}
      </TouchableOpacity>


    </View>
    <Options onClose={closeOptions} isOpen={isOptionsOpen} />
  </>
  );
};

export default NavBar


const styles = StyleSheet.create({

  navbar: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    zIndex: 50,
  },

  navbarSolid: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  logo: { fontSize: 20, fontWeight: "bold" },
  linksContainer: { flexDirection: "row", alignItems: "center", gap: 16 },
  link: { color: "white", fontSize: 16 },
  linkSolid: { color: "#333" },
  ctaButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#16a34a",
    borderRadius: 999,
  },
  ctaText: { color: "white", fontWeight: "bold" },
});
