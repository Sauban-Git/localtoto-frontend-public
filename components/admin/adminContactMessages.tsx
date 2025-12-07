
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import adminApi from '../../services/adminApi';
import Toast from 'react-native-toast-message';
import MyButton from '../button';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const AdminContactMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get('/admin/contact-messages');
      setMessages(res.data?.messages || []);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Network error!",
        text2: err?.response?.data?.message || 'Failed to load messages'
      })
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Contact Messages</Text>

        <MyButton onPress={loadMessages} title='Refresh' disabled={loading} backgroundColor='#16a34a' />
        {/* <TouchableOpacity style={styles.refreshBtn} onPress={loadMessages}> */}
        {/*   <Text style={styles.refreshText}>Refresh</Text> */}
        {/* </TouchableOpacity> */}
      </View>

      {/* Loading */}
      {loading && (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#16a34a" />
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      )}

      {/* No messages */}
      {!loading && !error && messages.length === 0 && (
        <View style={styles.noDataBox}>
          <Text style={styles.noDataText}>No contact messages yet</Text>
        </View>
      )}

      {/* Messages List */}
      {!loading && !error && messages.length > 0 && (
        <View style={{ gap: 12 }}>
          {messages.map(msg => (
            <View
              key={msg.id}
              style={[
                styles.card,
                { borderLeftColor: msg.is_read ? '#d1d5db' : '#16a34a' }
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <View style={styles.rowSpace}>
                    <Text style={styles.cardName}>{msg.name}</Text>

                    {!msg.is_read && (
                      <View style={styles.newBadge}>
                        <Text style={styles.newText}>New</Text>
                      </View>
                    )}
                  </View>

                  <View style={{ marginTop: 4 }}>
                    <Text style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Email: </Text>
                      {msg.email}
                    </Text>
                    <Text style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Phone: </Text>
                      {msg.phone}
                    </Text>
                    <Text style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Subject: </Text>
                      {msg.subject}
                    </Text>
                    <Text style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Date: </Text>
                      {formatDate(msg.created_at)}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.messageBox}>
                <Text style={styles.messageText}>{msg.message}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f9fafb' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '600', color: '#1f2937' },
  refreshBtn: {
    backgroundColor: '#16a34a',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6
  },
  refreshText: { color: '#fff', fontWeight: '600' },

  centerBox: { alignItems: 'center', paddingVertical: 40 },
  loadingText: { marginTop: 8, color: '#6b7280' },

  errorBox: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    padding: 12,
    borderRadius: 6
  },
  errorText: { color: '#b91c1c' },

  noDataBox: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2
  },
  noDataText: { color: '#6b7280' },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    elevation: 2,
    borderLeftWidth: 4
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },

  cardName: { fontSize: 18, fontWeight: '600', color: '#1f2937' },

  newBadge: {
    backgroundColor: '#bbf7d0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4
  },
  newText: { fontSize: 12, fontWeight: '600', color: '#166534' },

  rowSpace: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  infoItem: { fontSize: 14, color: '#4b5563' },
  infoLabel: { fontWeight: '600' },

  messageBox: {
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    marginTop: 12,
    paddingTop: 12
  },
  messageText: { color: '#374151', fontSize: 15 }
});

export default AdminContactMessages;
