
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StepIndicator({ step }: { step: number }) {
  const circle = (n: number) => (
    <View
      style={[
        styles.circle,
        step === n
          ? styles.active
          : step > n
            ? styles.completed
            : styles.inactive
      ]}
    >
      <Text style={{ color: step >= n ? "#fff" : "#555" }}>{n}</Text>
    </View>
  );

  return (
    <View style={styles.row}>
      {circle(1)}
      <View style={[styles.line, step > 1 && { backgroundColor: "#22c55e" }]} />
      {circle(2)}
      <View style={[styles.line, step > 2 && { backgroundColor: "#22c55e" }]} />
      {circle(3)}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "center", marginVertical: 20 },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center"
  },
  active: { backgroundColor: "#22c55e" },
  completed: { backgroundColor: "#86efac" },
  inactive: { backgroundColor: "#e5e7eb" },
  line: {
    width: 40,
    height: 4,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 4,
    borderRadius: 2
  }
});
