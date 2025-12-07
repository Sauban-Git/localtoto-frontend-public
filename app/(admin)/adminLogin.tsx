
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import adminApi from '../../services/adminApi';
import Toast from 'react-native-toast-message';
import MyButton from '@/components/button';
import AnimatedBackground from '@/components/animatedBackground';

const AdminLogin = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {

    try {
      console.log('[AdminLogin] Attempting login with phone:', phone);
      const res = await adminApi.post('/admin/login', { phone, password });
      console.log('[AdminLogin] Login response:', res.data);

      const access = res.data?.access;
      const refresh = res.data?.refresh;

      if (!access || !refresh) {
        Toast.show({
          type: "error",
          text1: "Authentication error!",
          text2: res.data.message || 'User is not authorized'
        })
        return;
      }

      await AsyncStorage.setItem('adminAccess', access);
      await AsyncStorage.setItem('adminRefresh', refresh);
      await AsyncStorage.setItem('adminPhone', phone);

      const redirectTo = route.params?.from || 'AdminDashboard';

      navigation.replace(redirectTo);
    } catch (err: any) {
      console.error('[AdminLogin] Login error:', err);
      Toast.show({
        type: "error",
        text1: "Authentication error!",
        text2: err?.response?.data?.message || 'User is not authorized',
        position: "bottom",
      })
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AnimatedBackground />
      <View style={styles.card}>
        <Text style={styles.heading}>Admin Login</Text>
        <Text style={styles.subheading}>Sign in to access the dashboard</Text>

        <View style={{ gap: 16 }}>
          <View>
            <Text style={styles.label}>Mobile Number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={10}
              placeholder="Enter 10-digit number"
            />
          </View>

          <View>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••••"
            />
          </View>

          <MyButton onPress={handleSubmit} title='Sign In' backgroundColor='#16a34a' />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AdminLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 3
  },
  heading: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1f2937'
  },
  subheading: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20
  },
  label: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 16
  },
  error: {
    color: '#dc2626',
    fontSize: 14
  },
  button: {
    backgroundColor: '#16a34a',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 4,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16
  }
});

