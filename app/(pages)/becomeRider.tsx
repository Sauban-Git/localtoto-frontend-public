
import MyButton from '@/components/button';
import OtpBox from '@/components/otpBox';
import Step1Personal from '@/components/screens/step1Personal';
import Step3Documents from '@/components/screens/step2Documents';
import Step2Vehicle from '@/components/screens/step2Vehicle';
import StepIndicator from '@/components/stepIndicator';
import useRiderOtpVerification from '@/hooks/useRiderOtpVerification';
import api from '@/services/api';
import React, { useState, useEffect } from 'react';
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

  const [phoneVerified, setPhoneVerified] = useState(false);

  // Call the hook once and monitor authentication state
  const riderOtpHook = useRiderOtpVerification();

  useEffect(() => {
    setPhoneVerified(riderOtpHook.isAuthenticated);
  }, [riderOtpHook.isAuthenticated]);

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
        <>
          <Step1Personal
            form={form}
            setForm={setForm}
          />
          <OtpBox otpHook={riderOtpHook} />
        </>
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
          {step > 1 && <MyButton title="Previous" onPress={() => setStep(step - 1)} backgroundColor='#7DA7D9' />}

          {step < 3 && (
            <MyButton
              title="Next"
              onPress={() => setStep(step + 1)}
              disabled={step === 1 && !phoneVerified}
              backgroundColor='#8EC6A3'
            />
          )}

          {step === 3 && <MyButton title="Submit Application" onPress={submit} backgroundColor='#63B28D' />}
        </View>
      )}
    </ScrollView>
  );
}

export default BecomeRider;

