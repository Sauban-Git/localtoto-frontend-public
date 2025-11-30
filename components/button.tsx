
import { colors } from "@/constants/theme";
import { useColors } from "@/hooks/useColors";
import { Pressable, Text, StyleSheet } from "react-native";

export default function MyButton({ title, onPress }: { title: string, onPress: () => void }) {
  const c = useColors()
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={[styles.buttonText, { color: c.text }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "green",
    padding: 12,
    marginHorizontal: 10,
    borderColor: "#ccc",
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    marginTop: 40,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
  },
});
