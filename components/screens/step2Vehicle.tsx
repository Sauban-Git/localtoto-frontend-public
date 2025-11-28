
import React from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';   // <-- FIXED
import TextInputField from '../input/textInputField';

export default function Step2Vehicle({ form, setForm }: any) {
  return (
    <View>

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        Vehicle Information
      </Text>

      {/* Vehicle Type */}
      <Picker
        selectedValue={form.vehicleType}
        onValueChange={(v: any) => setForm({ ...form, vehicleType: v })}
        style={{ backgroundColor: '#f2f2f2', marginVertical: 8 }}
      >
        <Picker.Item label="Select Vehicle Type" value="" />
        <Picker.Item label="E-Rickshaw" value="e-rickshaw" />
        <Picker.Item label="E-Auto" value="e-auto" />
        <Picker.Item label="Other" value="other" />
      </Picker>

      {/* Vehicle Number */}
      <TextInputField
        icon="document"
        placeholder="Vehicle Number"
        value={form.vehicleNumber}
        onChange={(t) => setForm({ ...form, vehicleNumber: t })}
      />

      {/* Experience */}
      <Picker
        selectedValue={form.experience}
        onValueChange={(v: any) => setForm({ ...form, experience: v })}
        style={{ backgroundColor: '#f2f2f2', marginVertical: 8 }}
      >
        <Picker.Item label="Select Experience" value="" />
        <Picker.Item label="0-1 years" value="0-1" />
        <Picker.Item label="1-3 years" value="1-3" />
        <Picker.Item label="3-5 years" value="3-5" />
        <Picker.Item label="5+ years" value="5+" />
      </Picker>

    </View>
  );
}

