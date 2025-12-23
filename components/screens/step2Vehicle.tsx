
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import TextInputField from '@/components/input/textInputField';
import { Ionicons } from '@expo/vector-icons';

export default function Step2Vehicle({ form, setForm }: any) {
  return (
    <View>

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        Vehicle Information
      </Text>

      {/* Vehicle Type */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={form.vehicleType}
          onValueChange={(v) => setForm({ ...form, vehicleType: v })}
          style={styles.picker}
        >
          <Picker.Item label="Select Vehicle Type" value="" />
          <Picker.Item label="E-Rickshaw" value="e-rickshaw" />
          <Picker.Item label="E-Auto" value="e-auto" />
          <Picker.Item label="Other" value="other" />
        </Picker>

        {/* Right arrow */}
        <Ionicons
          name="chevron-down"
          size={20}
          color="#666"
          style={styles.arrow}
        />
      </View>

      {/* Vehicle Number */}
      <TextInputField
        icon="document"
        placeholder="Vehicle Number"
        value={form.vehicleNumber}
        onChange={(t) => setForm({ ...form, vehicleNumber: t })}
      />

      {/* Experience */}

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={form.experience}
          onValueChange={(v) => setForm({ ...form, experience: v })}
          style={styles.picker}
        >
          <Picker.Item label="Select experience" value="" />
          <Picker.Item label="0-1 year" value="0-1 year" />
          <Picker.Item label="1-3 years" value="1-2 years" />
          <Picker.Item label="3-5 years" value="3-5 years" />
          <Picker.Item label="5+ years" value="5+ years" />
        </Picker>

        {/* Right arrow */}
        <Ionicons
          name="chevron-down"
          size={20}
          color="#666"
          style={styles.arrow}
        />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
    position: 'relative',
    justifyContent: 'center',
  },
  picker: {
    height: 50,
    paddingRight: 40, // space for arrow
    color: '#000',
  },
  arrow: {
    position: 'absolute',
    right: 12,
    pointerEvents: 'none', // so picker still opens
  },
});
