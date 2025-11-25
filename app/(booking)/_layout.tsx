// _layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";

export default function Layout() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar
        style="dark"
        translucent={true}
        backgroundColor="#000"
      />

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

