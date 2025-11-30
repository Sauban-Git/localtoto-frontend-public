
// _layout.tsx
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "@/components/navbar";
import { Stack } from "expo-router";

const Layout = () => {
  return (
    <SafeAreaView style={styles.container} >
      <NavBar />

      <View style={styles.screen}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>

    </SafeAreaView>
  );
};

export default Layout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
});
