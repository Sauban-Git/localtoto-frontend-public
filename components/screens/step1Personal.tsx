
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import TextInputField from '@/components/input/textInputField';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  form: any;
  setForm: (p: any) => void;
}

export default function Step1Personal({
  form,
  setForm,
}: Props) {
  const [showDobPicker, setShowDobPicker] = useState(false);
  return (
    <View>
      <TextInputField
        icon="person"
        placeholder="Full Name"
        value={form.fullName}
        onChange={(t) => setForm({ ...form, fullName: t })}
      />

      <TextInputField
        icon="mail"
        placeholder="Email"
        value={form.email}
        onChange={(t) => setForm({ ...form, email: t })}
      />

      <TextInputField
        icon="location"
        placeholder="Full Address"
        value={form.address}
        onChange={(t) => setForm({ ...form, address: t })}
      />

      {/* DOB FIELD */}
      <Pressable
        style={styles.dobField}
        onPress={() => setShowDobPicker(true)}
      >
        <Ionicons name="calendar-outline" size={20} color="#888" />
        <Text style={styles.dobText}>
          {form.dob
            ? new Date(form.dob).toDateString()
            : "Date of Birth"}
        </Text>
      </Pressable>

      {showDobPicker && (
        <DateTimePicker
          value={form.dob ? new Date(form.dob) : new Date(2000, 0, 1)}
          mode="date"
          maximumDate={new Date()}
          onChange={(_, selectedDate) => {
            setShowDobPicker(false);
            if (selectedDate) {
              setForm({ ...form, dob: selectedDate.toISOString() });
            }
          }}
        />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  dobField: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    marginTop: 12,
  },
  dobText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#555",
  },
});
