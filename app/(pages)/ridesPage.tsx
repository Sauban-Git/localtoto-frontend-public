
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RidesPage: React.FC = () => {
  const rideTypes = [
    {
      title: 'Standard Ride',
      description: 'Perfect for everyday travel with comfortable seating and reliable service.',
      features: ['Up to 3 passengers', 'Standard pricing', 'Regular e-rickshaw'],
      icon: 'people-outline',
    },
    {
      title: 'Premium Ride',
      description: 'Enhanced comfort with premium e-rickshaws and experienced drivers.',
      features: ['Up to 3 passengers', 'Premium pricing', 'Luxury e-rickshaw'],
      icon: 'star-outline',
    },
    {
      title: 'Express Ride',
      description: 'Quick and efficient service for time-sensitive travel needs.',
      features: ['Priority pickup', 'Fastest route', 'Experienced drivers'],
      icon: 'flash-outline',
    },
  ];

  const rideFeatures = [
    {
      icon: 'location-outline',
      title: 'Easy Booking',
      description: 'Book your ride in seconds through our app or website',
    },
    {
      icon: 'time-outline',
      title: 'Quick Pickup',
      description: 'Get picked up within minutes of booking',
    },
    {
      icon: 'card-outline',
      title: 'Multiple Payment Options',
      description: 'Pay via cash, card, or digital wallets',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Book Your Ride</Text>
          <Text style={styles.heroSubtitle}>
            Choose from our range of eco-friendly e-rickshaw services
          </Text>
        </View>
      </View>

      {/* Ride Types Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Ride Options</Text>
        <View style={styles.grid}>
          {rideTypes.map((ride, index) => (
            <View key={index} style={styles.card}>
              <Ionicons name={ride.icon as any} size={32} color="#16A34A" style={styles.cardIcon} />
              <Text style={styles.cardTitle}>{ride.title}</Text>
              <Text style={styles.cardDescription}>{ride.description}</Text>
              <View style={styles.cardList}>
                {ride.features.map((feature, i) => (
                  <View key={i} style={styles.cardListItem}>
                    <Text style={styles.cardListBullet}>•</Text>
                    <Text style={styles.cardListText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Features Section */}
      <View style={[styles.section, { backgroundColor: '#fff' }]}>
        <Text style={styles.sectionTitle}>Why Choose Us</Text>
        <View style={styles.grid}>
          {rideFeatures.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureIconWrapper}>
                <Ionicons name={feature.icon as any} size={28} color="#16A34A" />
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Pricing Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transparent Pricing</Text>
        <View style={styles.pricingCard}>
          <View style={styles.pricingRow}>
            <View>
              <Text style={styles.pricingTitle}>Base Fare</Text>
              <Text style={styles.pricingDescription}>Starting price for all rides</Text>
            </View>
            <Text style={styles.pricingAmount}>₹30</Text>
          </View>
          <View style={styles.pricingRow}>
            <View>
              <Text style={styles.pricingTitle}>Per Kilometer Rate</Text>
              <Text style={styles.pricingDescription}>Charged based on distance traveled</Text>
            </View>
            <Text style={styles.pricingAmount}>₹10/km</Text>
          </View>
          <View style={styles.pricingRow}>
            <View>
              <Text style={styles.pricingTitle}>Waiting Time</Text>
              <Text style={styles.pricingDescription}>Charged per minute of waiting</Text>
            </View>
            <Text style={styles.pricingAmount}>₹1/min</Text>
          </View>
          <Text style={styles.pricingNote}>
            *Prices may vary based on demand, time of day, and special events
          </Text>
        </View>
      </View>

      {/* CTA Section */}
      <View style={styles.cta}>
        <Text style={styles.ctaTitle}>Ready to Ride?</Text>
        <Text style={styles.ctaSubtitle}>
          Download our app and book your first ride today
        </Text>
        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Download App</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  hero: { backgroundColor: '#16A34A', paddingVertical: 40, paddingHorizontal: 20 },
  heroContent: { maxWidth: 600, alignSelf: 'center', alignItems: 'center' },
  heroTitle: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 10, textAlign: 'center' },
  heroSubtitle: { fontSize: 18, color: '#E5E7EB', textAlign: 'center' },

  section: { paddingVertical: 40, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 20 },
  card: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  cardIcon: { marginBottom: 15 },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 8 },
  cardDescription: { fontSize: 14, color: '#4B5563', marginBottom: 12 },
  cardList: { marginTop: 5 },
  cardListItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  cardListBullet: { color: '#16A34A', marginRight: 6 },
  cardListText: { fontSize: 14, color: '#4B5563' },

  featureCard: {
    width: 220,
    alignItems: 'center',
    marginBottom: 20,
  },
  featureIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4, textAlign: 'center' },
  featureDescription: { fontSize: 14, color: '#4B5563', textAlign: 'center' },

  pricingCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 5 },
  pricingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  pricingTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
  pricingDescription: { fontSize: 14, color: '#4B5563' },
  pricingAmount: { fontSize: 18, fontWeight: 'bold', color: '#16A34A' },
  pricingNote: { fontSize: 12, color: '#6B7280', marginTop: 10, textAlign: 'center' },

  cta: { backgroundColor: '#16A34A', paddingVertical: 40, paddingHorizontal: 20, alignItems: 'center' },
  ctaTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 10, textAlign: 'center' },
  ctaSubtitle: { fontSize: 16, color: '#E5E7EB', marginBottom: 20, textAlign: 'center' },
  ctaButton: { backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 30 },
  ctaButtonText: { fontSize: 16, fontWeight: '600', color: '#16A34A' },
});

export default RidesPage;
