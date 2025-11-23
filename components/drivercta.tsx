
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const benefits = [
  { icon: <MaterialCommunityIcons name="currency-inr" size={32} color="#16A34A" />, title: 'Earn More', description: 'Competitive earnings with flexible working hours' },
  { icon: <FontAwesome5 name="clock" size={32} color="#16A34A" />, title: 'Flexible Hours', description: 'Work when you want, as much as you want' },
  { icon: <MaterialCommunityIcons name="shield-check" size={32} color="#16A34A" />, title: 'Safe & Secure', description: 'Insurance coverage and 24/7 support' },
  { icon: <FontAwesome5 name="users" size={32} color="#16A34A" />, title: 'Growing Community', description: 'Join thousands of successful drivers' },
];

const DriverCTA: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Become a Driver Partner</Text>
        <Text style={styles.subtitle}>Join our network of drivers and start earning with your e-rickshaw</Text>
      </View>

      {/* Benefits */}
      <View style={styles.grid}>
        {benefits.map((benefit, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.iconContainer}>{benefit.icon}</View>
            <Text style={styles.cardTitle}>{benefit.title}</Text>
            <Text style={styles.cardDesc}>{benefit.description}</Text>
          </View>
        ))}
      </View>

      {/* CTA */}
      <View style={styles.ctaContainer}>
        <Text style={styles.ctaTitle}>Ready to Start?</Text>
        <Text style={styles.ctaDesc}>Submit your application and we’ll reach out within 24 hours.</Text>
        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Submit Application</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default DriverCTA;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111827' },
  header: { paddingVertical: 40, paddingHorizontal: 20, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#d1d5db', textAlign: 'center' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 30 },
  card: { width: '48%', backgroundColor: '#1f2937', borderRadius: 12, padding: 15, marginBottom: 15, alignItems: 'center' },
  iconContainer: { marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 5, textAlign: 'center' },
  cardDesc: { fontSize: 14, color: '#9ca3af', textAlign: 'center' },

  ctaContainer: { marginHorizontal: 20, backgroundColor: '#16a34a', borderRadius: 14, padding: 20, alignItems: 'center' },
  ctaTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  ctaDesc: { fontSize: 16, color: '#d1fae5', textAlign: 'center', marginBottom: 15 },
  ctaButton: { backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 12 },
  ctaButtonText: { color: '#16a34a', fontWeight: 'bold', fontSize: 16 },
});

