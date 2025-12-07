
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import adminApi from '../../services/adminApi';
import { useRouter } from 'expo-router';

const AdminRideDetail = () => {
  const router = useRouter()

  // admin id
  const id = "sdlh"

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ride, setRide] = useState<any>(null);

  useEffect(() => {
    const loadRide = async () => {
      try {
        setLoading(true);
        const res = await adminApi.get(`/admin/rides/${id}`);
        setRide(res.data?.ride);
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Failed to load ride');
      } finally {
        setLoading(false);
      }
    };

    if (id) loadRide();
  }, [id]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={styles.loadingText}>Loading…</Text>
      </View>
    );

  if (error)
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );

  if (!ride)
    return (
      <View style={styles.center}>
        <Text style={styles.noData}>Not found</Text>
      </View>
    );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Ride Details</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      {/* Ride Info Card */}
      <View style={styles.card}>
        <InfoRow label="Ride ID:" value={ride.code || ride.id} />
        <InfoRow label="Date:" value={ride.date || '—'} />
        <InfoRow
          label="User:"
          value={`${ride.user}${ride.user_id ? ` (u${String(ride.user_id).padStart(4, '0')})` : ''}`}
        />
        <InfoRow
          label="Driver:"
          value={`${ride.driver}${ride.driver_id ? ` (d${String(ride.driver_id).padStart(4, '0')})` : ''}`}
        />

        <InfoRow label="From:" value={ride.pickup} full />
        <InfoRow label="To:" value={ride.dropoff} full />

        <InfoRow label="Fare:" value={`₹${Number(ride.fare || 0).toFixed(0)}`} />
        <InfoRow label="Status:" value={ride.status} />
      </View>
    </ScrollView>
  );
};

export default AdminRideDetail;

/* ----------- Helper Component ----------- */

const InfoRow = ({ label, value, full = false }: any) => (
  <View style={[styles.infoRow, full && { width: '100%' }]}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

/* ----------- Styles ----------- */

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9fafb'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  loadingText: { marginTop: 8, color: '#6b7280' },
  error: { color: '#dc2626', fontSize: 16 },
  noData: { color: '#6b7280', fontSize: 16 },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    alignItems: 'center'
  },
  title: { fontSize: 22, fontWeight: '600', color: '#1f2937' },

  backButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8
  },
  backText: { fontSize: 14, color: '#374151' },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 2,
    flexWrap: 'wrap'
  },

  infoRow: {
    width: '48%',
    marginBottom: 12
  },
  infoLabel: { color: '#6b7280', fontSize: 14 },
  infoValue: { fontWeight: '600', fontSize: 15, color: '#111827' }
});
