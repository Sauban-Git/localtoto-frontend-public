
import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  icon?: string;
  placeholder: string;
  value: string;
  onChange: (t: string) => void;
  secure?: boolean;
  disabled?: boolean;
}

export default function TextInputField({
  icon,
  placeholder,
  value,
  onChange,
  secure,
  disabled
}: Props) {
  return (
    <View style={styles.container}>
      {icon && <Ionicons name={icon as any} size={20} color="#666" style={styles.icon} />}
      <TextInput
        style={[styles.input, disabled && { backgroundColor: '#eee' }]}
        placeholder={placeholder}
        value={value}
        secureTextEntry={secure}
        onChangeText={onChange}
        editable={!disabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 10 },
  icon: { position: 'absolute', top: 18, left: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingLeft: 40,
    paddingVertical: 12,
    borderRadius: 10
  }
});
