
import { colors } from "@/constants/theme";
import { useColors } from "@/hooks/useColors";
import { Pressable, Text, StyleSheet } from "react-native";

export default function MyButton({ title, onPress }: { title: string, onPress: () => void }) {
  const c = useColors()
  return (
    <Pressable style={[styles.button, { backgroundColor: c.background, borderColor: c.border, borderWidth: 2 }]} onPress={onPress}>
      <Text style={[styles.buttonText, { color: c.text }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
  },
});
