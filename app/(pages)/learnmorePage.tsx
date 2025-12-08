
import React from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';

const LearnMorePage: React.FC = () => {
  const features = [
    {
      icon: <Ionicons name="leaf" size={48} color="#16A34A" />,
      title: 'Eco-Friendly Transportation',
      description: 'Our e-rickshaws are 100% electric, producing zero emissions and helping create a cleaner, greener environment for our cities.',
    },
    {
      icon: <MaterialIcons name="shield" size={48} color="#16A34A" />,
      title: 'Safe & Reliable',
      description: 'All our drivers are thoroughly vetted and trained. We maintain strict safety standards and regular vehicle maintenance checks.',
    },
    {
      icon: <Ionicons name="time-outline" size={48} color="#16A34A" />,
      title: '24/7 Service',
      description: 'Available round the clock, ensuring you can book a ride whenever you need it, day or night.',
    },
    {
      icon: <FontAwesome5 name="users" size={48} color="#16A34A" />,
      title: 'Community Impact',
      description: 'Creating employment opportunities for drivers while providing affordable transportation solutions for the community.',
    },
    {
      icon: <Ionicons name="location-outline" size={48} color="#16A34A" />,
      title: 'City-Wide Coverage',
      description: 'Extensive network covering all major areas of the city, ensuring you can reach your destination conveniently.',
    },
    {
      icon: <Ionicons name="flash-outline" size={48} color="#16A34A" />,
      title: 'Quick & Efficient',
      description: 'Fast pickup times and efficient routes to get you to your destination quickly and comfortably.',
    },
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Download Our App',
      description: 'Get started by downloading our user-friendly mobile app from the App Store or Google Play Store.',
    },
    {
      step: '2',
      title: 'Book Your Ride',
      description: 'Enter your pickup and drop locations, choose your preferred ride type, and confirm your booking.',
    },
    {
      step: '3',
      title: 'Track Your Ride',
      description: 'Follow your driver\'s location in real-time and get notified when they arrive.',
    },
    {
      step: '4',
      title: 'Enjoy Your Journey',
      description: 'Hop in and enjoy a comfortable, eco-friendly ride to your destination.',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.heroContent}>
          <View style={styles.heroText}>
            <Image source={require('./assets/full_logo.png')} style={styles.heroLogo} />
            <Text style={styles.heroTitle}>About Us</Text>
            <Text style={styles.heroSubtitle}>
              Revolutionizing urban transportation with eco-friendly e-rickshaws
            </Text>
          </View>
          <View style={styles.hero3D}>
            {/* <Erickshaw3D /> */}
            {/* no 3d for now */}
            <Image source={require('@/assets/images/rickshaw.png')} style={{ width: 200, height: 200, resizeMode: 'contain' }} />
          </View>
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureCard}>
            <View style={styles.featureIcon}>{feature.icon}</View>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDescription}>{feature.description}</Text>
          </View>
        ))}
      </View>

      {/* How It Works Section */}
      <View style={styles.howItWorksSection}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        {howItWorks.map((step, index) => (
          <View key={index} style={styles.stepContainer}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumber}>{step.step}</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDescription}>{step.description}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <Image source={require('./assets/full_logo.png')} style={styles.ctaLogo} />
        <Text style={styles.ctaTitle}>Ready to Experience?</Text>
        <Text style={styles.ctaSubtitle}>
          Join thousands of satisfied customers who have made the switch to eco-friendly transportation.
        </Text>
        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Download App Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  heroSection: { backgroundColor: '#16A34A', paddingVertical: 20 },
  heroContent: { flexDirection: 'column', alignItems: 'center', paddingHorizontal: 16 },
  heroText: { alignItems: 'center', marginBottom: 16 },
  heroLogo: { width: 120, height: 120, resizeMode: 'contain', marginBottom: 8 },
  heroTitle: { fontSize: 36, fontWeight: 'bold', color: 'white', textAlign: 'center' },
  heroSubtitle: { fontSize: 18, color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginTop: 8 },
  hero3D: { width: '100%', height: 300, backgroundColor: '#15803D', borderRadius: 16, overflow: 'hidden', marginTop: 16 },

  featuresSection: { paddingVertical: 20, paddingHorizontal: 16, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  featureCard: { width: '48%', backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  featureIcon: { backgroundColor: '#D1FAE5', width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  featureTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8, color: '#111827' },
  featureDescription: { fontSize: 14, color: '#4B5563' },

  howItWorksSection: { paddingVertical: 20, paddingHorizontal: 16, backgroundColor: 'white' },
  sectionTitle: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#111827' },
  stepContainer: { flexDirection: 'row', marginBottom: 16 },
  stepCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#16A34A', justifyContent: 'center', alignItems: 'center' },
  stepNumber: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  stepContent: { flex: 1, marginLeft: 12 },
  stepTitle: { fontSize: 18, fontWeight: '600', color: '#111827' },
  stepDescription: { fontSize: 14, color: '#4B5563' },

  ctaSection: { paddingVertical: 30, paddingHorizontal: 16, backgroundColor: '#16A34A', alignItems: 'center' },
  ctaLogo: { width: 100, height: 100, resizeMode: 'contain', marginBottom: 12 },
  ctaTitle: { fontSize: 28, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 8 },
  ctaSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginBottom: 16 },
  ctaButton: { backgroundColor: 'white', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 30 },
  ctaButtonText: { color: '#15803D', fontWeight: 'bold', fontSize: 16 },
});

export default LearnMorePage;
