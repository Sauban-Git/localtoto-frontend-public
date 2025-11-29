
import MyButton from "@/components/button";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import AnimatedBackground from "@/components/animatedBackground";

const Signup = () => {
  const router = useRouter();
  const c = useColors()

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    // handle signup....
    router.replace('/(booking)/bookingdetailpage')
  };

  return (
    <View style={[styles.container, { backgroundColor: c.card }]}>
      <AnimatedBackground />
      <Text style={[styles.title, { color: c.text }]}>Create Account</Text>

      <TextInput
        style={[styles.input, { backgroundColor: c.background }]}
        placeholder="Full Name"
        placeholderTextColor={c.textSecondary}
        value={formData.name}
        onChangeText={(text) => handleChange("name", text)}
      />

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

      <TextInput
        style={[styles.input, { backgroundColor: c.background }]}
        placeholder="Confirm Password"
        placeholderTextColor={c.textSecondary}
        secureTextEntry
        value={formData.confirmPassword}
        onChangeText={(text) => handleChange("confirmPassword", text)}
      />

      <MyButton title="Sign Up" onPress={handleSubmit} />
      <MyButton title="Become a Rider" onPress={() => router.replace('/(rider)/becomeRider')} />

      <View style={styles.loginTextContainer}>
        <Text style={{ color: c.textSecondary }}>Already have an account? </Text>
        <Text
          style={[styles.loginLink, { color: c.link }]}
          onPress={() => router.replace("/(auth)/login")}
        >
          Login{" "}
        </Text>
      </View>
    </View>
  );
};

export default Signup;

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
  loginTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginLink: {
    textDecorationLine: "underline",
  },
});
