
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { useRouter } from "expo-router"
import adminApi from '../../services/adminApi';

const AdminUserDetail = () => {

  const router = useRouter()
  const { id } = { id: "sdafhlkjh" }

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [rides, setRides] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await adminApi.get(`/admin/users/${id}`);
        setUser(res.data?.user);
        setRides(res.data?.rides || []);
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Failed to load user');
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={{ marginTop: 8 }}>Loading…</Text>
      </View>
    );

  if (error)
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );

  if (!user)
    return (
      <View style={styles.center}>
        <Text style={styles.noData}>Not found</Text>
      </View>
    );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>User Details</Text>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      {/* User Details */}
      <View style={styles.card}>
        <InfoRow label="ID:" value={user.id} />
        {user.code && <InfoRow label="Code:" value={user.code} />}
        <InfoRow label="Name:" value={`${user.first_name} ${user.last_name}`} />
        <InfoRow label="Phone:" value={user.phone} />
        {user.email && <InfoRow label="Email:" value={user.email} />}
        <InfoRow label="Joined:" value={user.joined_at || '—'} />
      </View>

      {/* Ride History */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Ride History</Text>

        {rides.length === 0 && (
          <View style={styles.noRidesBox}>
            <Text style={styles.noRidesText}>No rides found</Text>
          </View>
        )}

        {rides.length > 0 &&
          rides.map(r => (
            <View key={r.id} style={styles.rideRow}>
              <Text style={styles.rideLabel}>ID:</Text>
              <Text style={styles.rideValue}>{r.id}</Text>

              <Text style={styles.rideLabel}>Pickup:</Text>
              <Text style={styles.rideValue}>{r.pickup}</Text>

              <Text style={styles.rideLabel}>Dropoff:</Text>
              <Text style={styles.rideValue}>{r.dropoff}</Text>

              <Text style={styles.rideLabel}>Fare:</Text>
              <Text style={styles.rideValue}>
                ₹{(r.fare ?? 0).toFixed ? r.fare.toFixed(0) : r.fare}
              </Text>

              <Text style={styles.rideLabel}>Status:</Text>
              <Text style={styles.rideValue}>{r.status}</Text>

              <Text style={styles.rideLabel}>Date:</Text>
              <Text style={styles.rideValue}>{r.created_at || r.createdAt || ''}</Text>
            </View>
          ))}
      </View>
    </ScrollView>
  );
};

export default AdminUserDetail;

/* ---------------- Helper Component ---------------- */

const InfoRow = ({ label, value }: any) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f3f4f6'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  error: { color: '#dc2626', fontWeight: '500' },
  noData: { color: '#6b7280' },

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
    marginBottom: 20
  },

  infoRow: {
    marginBottom: 12
  },
  infoLabel: {
    color: '#6b7280',
    fontSize: 14
  },
  infoValue: {
    fontWeight: '600',
    fontSize: 15,
    color: '#111827'
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1f2937'
  },

  noRidesBox: {
    paddingVertical: 20,
    alignItems: 'center'
  },
  noRidesText: {
    color: '#6b7280'
  },

  rideRow: {
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    paddingVertical: 12,
    marginTop: 8
  },
  rideLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6b7280'
  },
  rideValue: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#111827'
  }
});
