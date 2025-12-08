
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const CareersPage: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.iconWrapper}>
        <MaterialIcons name='work' size={64} color="#16A34A" />
      </View>
      <Text style={styles.title}>Careers</Text>
      <Text style={styles.subtitle}>
        We are growing! Exciting opportunities are coming soon. Stay tuned for updates.
      </Text>
      <View style={styles.comingSoonBox}>
        <Text style={styles.comingSoonText}>🚀 Coming Soon!</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  iconWrapper: {
    marginBottom: 20,
    backgroundColor: '#D1FAE5',
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 30,
  },
  comingSoonBox: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 16,
    backgroundColor: '#16A34A',
  },
  comingSoonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default CareersPage;
