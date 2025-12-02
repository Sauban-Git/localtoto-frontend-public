
import React from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import useOtpVerification from "../hooks/useOtpVerification";

type PhoneVerificationCardProps = {
  otpHook: ReturnType<typeof useOtpVerification>;
};

export default function PhoneVerificationCard({ otpHook }: PhoneVerificationCardProps) {
  const {
    phoneNumber,
    otp,
    otpSent,
    otpFeedback,
    isSendingOtp,
    isVerifyingOtp,
    otpCooldown,
    otpSendCount,
    MAX_OTP_REQUESTS,
    isAuthenticated,

    setPhoneNumber,
    setOtp,
    handleSendOtp,
    handleVerifyOtp,
  } = otpHook;

  if (isAuthenticated) return null;

  return (
    <View style={{ backgroundColor: "white", padding: 20, borderRadius: 16, elevation: 4 }}>
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>
        Verify Your Phone Number
      </Text>

      {/* phone input */}
      <Text style={{ fontSize: 14, marginBottom: 6 }}>Phone Number</Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 10,
            borderRadius: 10,
            marginRight: 8,
          }}
          placeholder="10-digit number"
          keyboardType="number-pad"
          value={phoneNumber}
          maxLength={10}
          onChangeText={setPhoneNumber}
        />

        <TouchableOpacity
          disabled={
            !phoneNumber ||
            phoneNumber.length !== 10 ||
            isSendingOtp ||
            otpCooldown > 0 ||
            otpSendCount >= MAX_OTP_REQUESTS
          }
          onPress={handleSendOtp}
          style={{
            backgroundColor: "#16a34a",
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 10,
            opacity:
              !phoneNumber ||
                phoneNumber.length !== 10 ||
                isSendingOtp ||
                otpCooldown > 0 ||
                otpSendCount >= MAX_OTP_REQUESTS
                ? 0.5
                : 1,
          }}
        >
          {isSendingOtp ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{ color: "white", fontWeight: "600" }}>
              {otpSendCount >= MAX_OTP_REQUESTS
                ? "Limit"
                : otpCooldown > 0
                  ? `Wait ${otpCooldown}s`
                  : "Send OTP"}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {otpFeedback && (
        <Text
          style={{
            marginTop: 6,
            color:
              otpFeedback.type === "error"
                ? "red"
                : otpFeedback.type === "success"
                  ? "green"
                  : "#555",
          }}
        >
          {otpFeedback.message}
        </Text>
      )}

      {/* OTP input */}
      {otpSent && (
        <View style={{ marginTop: 14 }}>
          <Text style={{ marginBottom: 6 }}>Enter OTP</Text>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 10,
                borderRadius: 10,
                marginRight: 8,
              }}
              placeholder="6-digit OTP"
              keyboardType="number-pad"
              value={otp}
              maxLength={6}
              onChangeText={setOtp}
            />

            <TouchableOpacity
              disabled={!otp || otp.length !== 6 || isVerifyingOtp}
              onPress={handleVerifyOtp}
              style={{
                backgroundColor: "#2563eb",
                paddingHorizontal: 14,
                paddingVertical: 10,
                borderRadius: 10,
                opacity: !otp || otp.length !== 6 || isVerifyingOtp ? 0.5 : 1,
              }}
            >
              {isVerifyingOtp ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={{ color: "white", fontWeight: "600" }}>Verify</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
