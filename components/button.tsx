
import { colors } from "@/constants/theme";
import { useColors } from "@/hooks/useColors";
import { Pressable, Text, StyleSheet } from "react-native";

type MyButtonProps = {
  title: string;
  onPress: () => void;
  backgroundColor?: string; // optional background color prop
  disabled?: boolean
};

export default function MyButton({ title, onPress, backgroundColor, disabled }: MyButtonProps) {
  const c = useColors();
  return (
    <Pressable
      style={[styles.button, { backgroundColor: backgroundColor || "green" }]}
      disabled={disabled}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, { color: c.text }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
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

