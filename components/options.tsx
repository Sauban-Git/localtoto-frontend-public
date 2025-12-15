
import { useRouter } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface OptionsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Options: React.FC<OptionsProps> = ({ isOpen, onClose }) => {
  const router = useRouter()

  if (!isOpen) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <View style={styles.popup}>
        <TouchableOpacity style={styles.option} onPress={() => { router.push('/(tabs)/home') }}>
          <Text style={styles.optionText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => { }}>
          <Text style={styles.optionText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => { router.push('/(pages)/ridesPage') }}>
          <Text style={styles.optionText}>Rides</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => { router.push('/(pages)/safetyPage') }}>
          <Text style={styles.optionText}>Safety</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => { router.push('/(pages)/about') }}>
          <Text style={styles.optionText}>About</Text>
        </TouchableOpacity><TouchableOpacity style={styles.option} onPress={() => { router.push('/(pages)/becomeRider') }}>
          <Text style={styles.optionText}>Become a Rider</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => { router.push('/(pages)/faqs') }}>
          <Text style={styles.optionText}>FAQs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => { router.push('/(pages)/careersPage') }}>
          <Text style={styles.optionText}>Careers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => { router.push('/(pages)/learnmorePage') }}>
          <Text style={styles.optionText}>Learn more</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push('/(pages)/contactuspage')}
        >
          <Text style={styles.optionText}>Contact Us</Text>
        </TouchableOpacity>

      </View>
    </View >
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "transparent",
  },
  popup: {
    position: "absolute",
    top: 60, // adjust as needed
    right: 16,
    width: 180,
    borderRadius: 8,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: "white"
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 16,
  },
});
