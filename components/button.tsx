
import { useColors } from "@/hooks/useColors";
import { Pressable, Text, StyleSheet, ActivityIndicator } from "react-native";

type MyButtonProps = {
  title: string;
  onPress: () => void;
  backgroundColor?: string; // optional background color prop
  disabled?: boolean;
  loading?: boolean;
};

export default function MyButton({ title, onPress, backgroundColor, disabled, loading }: MyButtonProps) {
  const c = useColors();

  return (
    <Pressable
      style={[
        styles.button,
        { backgroundColor: backgroundColor || "green", opacity: disabled ? 0.7 : 1 }
      ]}
      disabled={disabled}
      onPress={onPress}
    >
      {disabled && loading ? (
        <ActivityIndicator size="small" color={c.text} />
      ) : disabled ? (
        <Text style={[styles.buttonText, { color: c.text, opacity: 0.5 }]}>{title}</Text>
      ) :
        <Text style={[styles.buttonText, { color: c.text }]}>{title}</Text>
      }
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
    justifyContent: "center",
    marginTop: 40,
    flexDirection: "row",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
  },
});

