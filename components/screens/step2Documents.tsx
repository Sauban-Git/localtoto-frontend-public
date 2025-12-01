
import React from 'react';
import { View, Text, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import MyButton from '../button';

export default function Step3Documents({ form, setForm }: any) {
  const pickImage = async (field: string) => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7
    });
    if (!res.canceled) {
      setForm({ ...form, [field]: res.assets[0] });
    }
  };

  return (
    <View>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Documents</Text>

      <MyButton title="Select PAN Card" onPress={() => pickImage("panCard")} backgroundColor='#ffffff' />
      {form.panCard && <Image source={{ uri: form.panCard.uri }} style={{ width: 120, height: 120 }} />}

      <MyButton title="Select Aadhaar Card" onPress={() => pickImage("aadhaarCard")} backgroundColor='#ffffff' />
      {form.aadhaarCard && <Image source={{ uri: form.aadhaarCard.uri }} style={{ width: 120, height: 120 }} />}
    </View>
  );
}
