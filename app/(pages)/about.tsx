import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Svg, { Circle, Path } from "react-native-svg";
const AboutPage = () => {
  const stats = [
    { number: '50K+', label: 'Happy Customers', icon: <Feather name="users" size={40} color="#16A34A" /> },
    { number: '1000+', label: 'Active Drivers', icon: <Feather name="award" size={40} color="#16A34A" /> },
    { number: '95%', label: 'Customer Satisfaction', icon: <Feather name="heart" size={40} color="#16A34A" /> },
    { number: '10+', label: 'Cities Covered', icon: <Feather name="globe" size={40} color="#16A34A" /> },
  ];

  return (
    <ScrollView style={styles.container}>

      <View style={styles.hero}>
        <Text style={styles.heroTitle}>About Us</Text>
        <Text style={styles.heroSubtitle}>
          Revolutionizing urban transportation with eco-friendly e-rickshaws
        </Text>
      </View>

      {/* Mission Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Mission</Text>
        <Text style={styles.sectionText}>
          {"At Local ToTo, we're committed to providing affordable, eco-friendly,"}
          {"and convenient transportation solutions. Our goal is to reduce carbon"}
          {"emissions while making urban travel accessible to everyone."}
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View style={{ marginBottom: 10 }}>{stat.icon}</View>
            <Text style={styles.statNumber}>{stat.number}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* CEO Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Leadership</Text>
        <View style={styles.ceoCard}>
          <View style={styles.ceoAvatar}>
            <Text style={styles.ceoInitials}>AB</Text>
          </View>
          <View style={styles.ceoInfo}>
            <Text style={styles.ceoName}>Anmo Bharti</Text>
            <Text style={styles.ceoRole}>Chief Executive Officer</Text>
            <Text style={styles.sectionText}>
              Anmo Bharti is the visionary CEO behind Local ToTo, driving
              innovation in sustainable transportation. With a passion for
              environmental conservation and community service, he has expanded
              Local ToTo across multiple cities, reducing emissions and creating
              opportunities.
            </Text>
          </View>
        </View>
      </View>

      {/* Developer Team */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Developer Team</Text>

        <View style={styles.devGrid}>
          {/* Dev 1 */}
          <View style={styles.devCard}>
            <View style={styles.devAvatar}>
              <Text style={styles.devInitials}>RP</Text>
            </View>
            <Text style={styles.devName}>Rishav Prakash</Text>
            <Text style={styles.devRole}>Full Stack Developer</Text>
          </View>

          {/* Dev 2 */}
          <View style={styles.devCard}>
            <View style={styles.devAvatar}>
              <Text style={styles.devInitials}>PS</Text>
            </View>
            <Text style={styles.devName}>Priyanshu Singh</Text>
            <Text style={styles.devRole}>Full Stack Developer</Text>
          </View>
        </View>
      </View>

      {/* Story Section */}
      <View style={styles.storyContainer}>
        <View style={{ flex: 1 }}>
          <Text style={styles.storyTitle}>Our Story</Text>
          <Text style={styles.sectionText}>
            Local ToTo was founded in 2023 with a vision to transform urban
            transportation. We recognized the need for sustainable mobility
            solutions that could serve both the environment and the community.
          </Text>
          <Text style={styles.sectionText}>
            Starting with just 10 e-rickshaws in one city, we&#39ve grown to become
            a trusted name in eco-friendly transportation across multiple cities.
          </Text>
          <Text style={styles.sectionText}>
            Today, we continue to innovate and expand our services while staying
            true to our core values.
          </Text>
        </View>

        {/* Illustration */}
        <View style={styles.illustration}>
          <Svg
            viewBox="0 0 400 300"
            fill="none"
            width="100%"
            height="100%"
          >
            {/* E-rickshaw body */}
            <Path
              d="M100 150C100 122.386 122.386 100 150 100H250C277.614 100 300 122.386 300 150V200C300 227.614 277.614 250 250 250H150C122.386 250 100 227.614 100 200V150Z"
              fill="#16A34A"
            />

            {/* E-rickshaw top */}
            <Path
              d="M150 120C134.536 120 122 132.536 122 148V202C122 217.464 134.536 230 150 230H250C265.464 230 278 217.464 278 202V148C278 132.536 265.464 120 250 120H150Z"
              fill="white"
            />

            {/* E-rickshaw wheels */}
            <Circle cx="150" cy="200" r="20" fill="#16A34A" />
            <Circle cx="250" cy="200" r="20" fill="#16A34A" />
            <Circle cx="150" cy="200" r="10" fill="white" />
            <Circle cx="250" cy="200" r="10" fill="white" />

            {/* E-rickshaw handle */}
            <Path
              d="M200 120V80"
              stroke="#16A34A"
              strokeWidth="8"
              strokeLinecap="round"
            />

            {/* E-rickshaw seat */}
            <Path
              d="M150 180H250"
              stroke="#16A34A"
              strokeWidth="8"
              strokeLinecap="round"
            />

            {/* E-rickshaw headlight */}
            <Circle cx="280" cy="150" r="10" fill="#FFD700" />

            {/* E-rickshaw details */}
            <Path
              d="M150 150H250"
              stroke="#16A34A"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <Path
              d="M170 130H230"
              stroke="#16A34A"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </Svg>
        </View>
      </View>

      {/* Values Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Values</Text>

        <View style={styles.valuesGrid}>
          {/* Value 1 */}
          <View style={styles.valueCard}>
            <View style={styles.valueIcon}>
              <Feather name="heart" size={30} color="#16A34A" />
            </View>
            <Text style={styles.valueTitle}>Sustainability</Text>
            <Text style={styles.sectionText}>
              We&#39re committed to reducing carbon emissions and promoting eco-friendly transportation.
            </Text>
          </View>

          {/* Value 2 */}
          <View style={styles.valueCard}>
            <View style={styles.valueIcon}>
              <Feather name="users" size={30} color="#16A34A" />
            </View>
            <Text style={styles.valueTitle}>Community</Text>
            <Text style={styles.sectionText}>
              We believe in creating opportunities for drivers and serving our communities.
            </Text>
          </View>

          {/* Value 3 */}
          <View style={styles.valueCard}>
            <View style={styles.valueIcon}>
              <Feather name="award" size={30} color="#16A34A" />
            </View>
            <Text style={styles.valueTitle}>Excellence</Text>
            <Text style={styles.sectionText}>
              We strive for excellence in service quality and customer satisfaction.
            </Text>
          </View>
        </View>
      </View>

    </ScrollView>
  );
};

export default AboutPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },

  hero: {
    backgroundColor: "#1f2937",
    paddingVertical: 50,
    alignItems: "center",
  },
  logo: { width: 140, height: 80, marginBottom: 15 },
  heroTitle: { fontSize: 32, fontWeight: "bold", color: "#fff", paddingTop: 20 },
  heroSubtitle: {
    marginTop: 8,
    color: "#fff",
    fontSize: 16,
    opacity: 0.9,
    textAlign: "center",
    paddingHorizontal: 20,
  },

  section: {
    padding: 20,
    marginTop: 40,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111",
    textAlign: "center",
    marginBottom: 15,
  },
  sectionText: {
    color: "#555",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 10,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  statCard: {
    width: "45%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    margin: 10,
    alignItems: "center",
    elevation: 2,
  },
  statNumber: { fontSize: 28, fontWeight: "bold", color: "#111" },
  statLabel: { color: "#777" },

  /* CEO Section */
  ceoCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 14,
    elevation: 3,
  },
  ceoAvatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#d1fae5",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 15,
  },
  ceoInitials: { fontSize: 40, color: "#16A34A", fontWeight: "bold" },
  ceoInfo: { alignItems: "center" },
  ceoName: { fontSize: 22, fontWeight: "bold", marginBottom: 4 },
  ceoRole: { fontSize: 18, color: "#16A34A", marginBottom: 10 },

  /* Devs */
  devGrid: {
    marginTop: 10,
  },
  devCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 14,
    marginBottom: 15,
    alignItems: "center",
    elevation: 2,
  },
  devAvatar: {
    width: 90,
    height: 90,
    backgroundColor: "#d1fae5",
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  devInitials: { fontSize: 28, fontWeight: "bold", color: "#16A34A" },
  devName: { fontSize: 18, fontWeight: "bold" },
  devRole: { color: "#777" },

  /* Story */
  storyContainer: {
    flexDirection: "column",
    padding: 20,
  },
  storyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 10,
    textAlign: "center",
  },
  illustration: {
    height: 200,
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 14,
    elevation: 3,
  },

  /* Values */
  valuesGrid: {
    marginTop: 20,
  },
  valueCard: {
    alignItems: "center",
    marginBottom: 20,
  },
  valueIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#d1fae5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  valueTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
});

