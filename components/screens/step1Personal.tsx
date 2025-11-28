
import React from 'react';
import { View, Text, Button } from 'react-native';
import TextInputField from '../input/textInputField';
import PhoneVerificationCard from '../phoneVerification';

interface Props {
  form: any;
  setForm: (p: any) => void;
  phoneVerified: boolean;
  sendOtp: () => void;
  verifyOtp: () => void;
  otp: string;
  setOtp: (t: string) => void;
  otpMessage: string;
  sending: boolean;
  verifying: boolean;
  otpSent: boolean;
}

export default function Step1Personal({
  form,
  setForm,
  phoneVerified,
  sendOtp,
  verifyOtp,
  otp,
  setOtp,
  otpMessage,
  sending,
  verifying,
  otpSent
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

      <TextInputField
        icon="call"
        placeholder="Phone"
        value={form.phone}
        onChange={(t) => setForm({ ...form, phone: t })}
        disabled={phoneVerified}
      />

      <PhoneVerificationCard />
    </View>
  );
}
