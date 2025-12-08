
import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const SafetyPage = () => {
  const safetyFeatures = [
    {
      icon: <Ionicons name="shield-checkmark" size={36} color="#16A34A" />,
      title: "Verified Drivers",
      description:
        "All our drivers undergo thorough background checks and verification processes.",
    },
    {
      icon: <MaterialIcons name="verified-user" size={36} color="#16A34A" />,
      title: "Driver Training",
      description:
        "Comprehensive training programs ensure our drivers are well-equipped with safety protocols.",
    },
    {
      icon: <Ionicons name="location" size={36} color="#16A34A" />,
      title: "Real-time Tracking",
      description:
        "Track your ride in real-time and share your journey with loved ones.",
    },
    {
      icon: <Ionicons name="call" size={36} color="#16A34A" />,
      title: "24/7 Support",
      description:
        "Our support team is available round the clock to assist you with any concerns.",
    },
    {
      icon: <Ionicons name="time" size={36} color="#16A34A" />,
      title: "Regular Maintenance",
      description:
        "All e-rickshaws undergo regular maintenance checks to ensure safe operation.",
    },
    {
      icon: <MaterialIcons name="warning" size={36} color="#16A34A" />,
      title: "Emergency Response",
      description:
        "Quick emergency response system in place for any unforeseen situations.",
    },
  ];

  return (
    <ScrollView style={styles.container}>

      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Your Safety is Our Priority</Text>
        <Text style={styles.heroSubtitle}>
          Comprehensive safety measures to ensure a secure and comfortable ride
        </Text>
      </View>

      {/* Safety Features */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Safety Features</Text>

        <View style={styles.grid}>
          {safetyFeatures.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.iconWrapper}>{feature.icon}</View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDesc}>{feature.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Safety Guidelines */}
      <View style={styles.section}>
        <Text style={styles.guidelinesHeader}>Safety Guidelines</Text>

        {/* Riders */}
        <View style={styles.guidelineCard}>
          <Text style={styles.guidelineTitle}>For Riders</Text>

          {[
            "Always verify the driver and vehicle details before boarding",
            "Share your ride details with friends or family",
            "Wear your seatbelt if available",
            "Report any safety concerns immediately",
          ].map((text, i) => (
            <View key={i} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{text}</Text>
            </View>
          ))}
        </View>

        {/* Drivers */}
        <View style={styles.guidelineCard}>
          <Text style={styles.guidelineTitle}>For Drivers</Text>

          {[
            "Regular vehicle maintenance and safety checks",
            "Follow traffic rules and speed limits",
            "Maintain professional conduct with riders",
            "Report any incidents or concerns to support",
          ].map((text, i) => (
            <View key={i} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{text}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Emergency Contact */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Emergency Contact</Text>

        <Text style={styles.emergencyDesc}>
          In case of any emergency, our support team is available 24/7
        </Text>

        <View style={styles.emergencyBox}>
          <Text style={styles.emergencyNumber}>1800-XXX-XXXX</Text>
          <Text style={styles.emergencyNote}>Available 24/7</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default SafetyPage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },

  // Hero
  hero: {
    backgroundColor: "#16A34A",
    paddingVertical: 50,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 32,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 18,
    color: "white",
    opacity: 0.9,
    textAlign: "center",
  },

  // Sections
  section: { padding: 24 },
  sectionHeader: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },

  // Grid
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  // Cards
  featureCard: {
    width: "48%",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    elevation: 3,
  },
  iconWrapper: { marginBottom: 12 },
  featureTitle: { fontSize: 18, fontWeight: "600", marginBottom: 6 },
  featureDesc: { fontSize: 14, color: "#555" },

  guidelinesHeader: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },

  guidelineCard: {
    backgroundColor: "#F9FAFB",
    padding: 18,
    borderRadius: 12,
    marginBottom: 18,
  },
  guidelineTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  bullet: {
    fontSize: 20,
    color: "#16A34A",
    marginRight: 8,
  },
  listText: { flex: 1, fontSize: 15, color: "#555" },

  emergencyDesc: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 16,
  },
  emergencyBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 14,
    alignItems: "center",
    elevation: 3,
  },
  emergencyNumber: {
    fontSize: 24,
    color: "#16A34A",
    fontWeight: "bold",
    marginBottom: 6,
  },
  emergencyNote: { fontSize: 14, color: "#666" },
});
