
import React from 'react';
import { View, Text, Button } from 'react-native';
import TextInputField from '../input/textInputField';
import OtpBox from '../otpBox';
import useRiderOtpVerification from '@/hooks/useRiderOtpVerification';

interface Props {
  form: any;
  setForm: (p: any) => void;
}

export default function Step1Personal({
  form,
  setForm,
}: Props) {

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

      <OtpBox />
    </View>
  );
}
