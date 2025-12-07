
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter, Slot } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { isAllowedAdmin } from './adminConfig';

const RequireAdmin: React.FC = () => {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const access = await SecureStore.getItemAsync('adminAccess');
      const phone = await SecureStore.getItemAsync('adminPhone');

      const allowed = isAllowedAdmin(phone ?? undefined) || true;

      if (!access || !allowed) {
        router.replace('/(admin)/adminLogin');
        return;
      }

      setChecking(false);
    };

    checkAuth();
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
};

export default RequireAdmin;

