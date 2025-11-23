
import AnimatedBackground from "@/components/animatedBackground";
import MyButton from "@/components/button";
import { useColors } from "@/hooks/useColors";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native"
const Login = () => {
  const c = useColors()
  const router = useRouter()

  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    router.replace('/(booking)/bookingdetailpage')
  };

  return (
    <View style={[styles.container, { backgroundColor: c.card }]}>
      <AnimatedBackground />
      <Text style={[styles.title, { color: c.text }]}>Sign In</Text>

      <TextInput
        style={[styles.input, { backgroundColor: c.background }]}
        placeholder="Phone"
        placeholderTextColor={c.textSecondary}
        keyboardType="phone-pad"
        value={formData.phone}
        onChangeText={(text) => handleChange("phone", text)}
      />

      <TextInput
        style={[styles.input, { backgroundColor: c.background }]}
        placeholder="Password"
        placeholderTextColor={c.textSecondary}
        secureTextEntry
        value={formData.password}
        onChangeText={(text) => handleChange("password", text)}
      />

      <MyButton title="Sign In" onPress={handleSubmit} />

      <View style={styles.signupTextContainer}>
        <Text style={{ color: c.text }}>New here? </Text>
        <Text
          style={[styles.signupLink, { color: c.link }]}
          onPress={() => router.replace("/(auth)/signup")}
        >
          Signup
        </Text>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    marginTop: 10,
  },
  signupTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signupLink: {
    textDecorationLine: "underline",
  },
});
