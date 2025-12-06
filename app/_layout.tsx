
// app/_layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />

      <Stack
        screenOptions={{
          headerShown: false,
          headerTintColor: "#fff",
        }}
      />
      <Toast />
    </>
  );
}
