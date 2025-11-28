
import Step1Personal from '@/components/screens/step1Personal';
import Step3Documents from '@/components/screens/step2Documents';
import Step2Vehicle from '@/components/screens/step2Vehicle';
import StepIndicator from '@/components/stepIndicator';
import api from '@/services/api';
import React, { useState } from 'react';
import { View, Button, Text, ScrollView } from 'react-native';

const BecomeRider = () => {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState<any>({
    fullName: '',
    email: '',
    address: '',
    phone: '',
    vehicleType: '',
    vehicleNumber: '',
    experience: '',
    panCard: null,
    aadhaarCard: null
  });

  // OTP STATES
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpMessage, setOtpMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  // Send OTP
  const sendOtp = async () => {
    try {
      setSending(true);
      await api.post('/riders/send-otp', { phoneNumber: form.phone });
      setOtpSent(true);
      setOtpMessage("OTP Sent");
    } catch {
      setOtpMessage("Failed to send OTP");
    } finally {
      setSending(false);
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    try {
      setVerifying(true);
      const res = await api.post('/riders/verify-otp', {
        phoneNumber: form.phone,
        otp
      });
      if (res.data.success) {
        setPhoneVerified(true);
        setOtpMessage("Phone Verified!");
      }
    } catch {
      setOtpMessage("Invalid OTP");
    } finally {
      setVerifying(false);
    }
  };

  const submit = async () => {
    const data = new FormData();

    Object.keys(form).forEach((key) => {
      const val = form[key];
      if (val && val.uri) {
        data.append(key, {
          uri: val.uri,
          name: `${key}.jpg`,
          type: "image/jpeg"
        } as any);
      } else {
        data.append(key, val);
      }
    });

    await api.post('/riders/applications', data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    setStep(4);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <StepIndicator step={step} />

      {step === 1 && (
        <Step1Personal
          form={form}
          setForm={setForm}
          phoneVerified={phoneVerified}
          sendOtp={sendOtp}
          verifyOtp={verifyOtp}
          otp={otp}
          setOtp={setOtp}
          otpMessage={otpMessage}
          otpSent={otpSent}
          sending={sending}
          verifying={verifying}
        />
      )}

      {step === 2 && <Step2Vehicle form={form} setForm={setForm} />}

      {step === 3 && <Step3Documents form={form} setForm={setForm} />}

      {step === 4 && (
        <Text style={{ fontSize: 22, textAlign: "center", marginTop: 40 }}>
          Application Submitted Successfully!
        </Text>
      )}

      {step < 4 && (
        <View style={{ marginTop: 20 }}>
          {step > 1 && <Button title="Previous" onPress={() => setStep(step - 1)} />}

          {step < 3 && (
            <Button
              title="Next"
              onPress={() => setStep(step + 1)}
              disabled={step === 1 && !phoneVerified}
            />
          )}

          {step === 3 && <Button title="Submit Application" onPress={submit} />}
        </View>
      )}
    </ScrollView>
  );
}

export default BecomeRider
