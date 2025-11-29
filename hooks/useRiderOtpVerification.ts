
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function useRiderOtpVerification() {
  console.log("hook rider verify")
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const [otpCooldown, setOtpCooldown] = useState(0);
  const [otpSendCount, setOtpSendCount] = useState(0);
  const MAX_OTP_REQUESTS = 5;

  const [otpFeedback, setOtpFeedback] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  // ---------------------------
  // COOL DOWN TIMER
  // ---------------------------
  useEffect(() => {
    if (otpCooldown <= 0) return;

    const interval = setInterval(() => {
      setOtpCooldown((v) => Math.max(0, v - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [otpCooldown]);

  useEffect(() => {
    const loadAuthState = async () => {
      const token = await SecureStore.getItemAsync("riderToken");
      const rider = await SecureStore.getItemAsync("rider");

      if (token && rider) {
        setIsAuthenticated(true);
        setPhoneNumber(JSON.parse(rider).phoneNumber);
      }
    };
    loadAuthState();
  }, []);

  // ---------------------------
  // SEND OTP (RIDER)
  // ---------------------------
  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      setOtpFeedback({
        type: "error",
        message: "Enter a valid 10-digit phone number.",
      });
      return;
    }

    if (otpSendCount >= MAX_OTP_REQUESTS) {
      setOtpFeedback({
        type: "error",
        message: "You have reached the OTP request limit.",
      });
      return;
    }

    if (otpCooldown > 0) {
      setOtpFeedback({
        type: "info",
        message: `Please wait ${otpCooldown}s before requesting again.`,
      });
      return;
    }

    setIsSendingOtp(true);
    setOtpFeedback(null);

    try {
      console.log(phoneNumber)
      const res = await api.post("/riders/send-otp", { phoneNumber });

      if (res.data?.success) {
        console.log("hook rider verify: ", res.data)
        setOtpSent(true);
        setOtpSendCount((v) => v + 1);
        setOtpCooldown(45);
        setOtpFeedback({ type: "success", message: "OTP sent successfully." });
      } else {
        setOtpFeedback({
          type: "error",
          message: res.data?.message || "Could not send OTP.",
        });
      }
    } catch (err: any) {
      console.log("didnt workl ", err)
      setOtpFeedback({
        type: "error",
        message: err?.response?.data?.message || "Failed to send OTP.",
      });
    } finally {
      setIsSendingOtp(false);
    }
  };

  // ---------------------------
  // VERIFY OTP (RIDER)
  // ---------------------------
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setOtpFeedback({
        type: "error",
        message: "Enter a valid 6-digit OTP.",
      });
      return;
    }

    setIsVerifyingOtp(true);

    try {
      const res = await api.post("/riders/verify-otp", {
        phoneNumber,
        otp,
      });

      if (res.data?.success) {
        setIsAuthenticated(true);
        setOtp("");
        setOtpSent(false);

        setOtpFeedback({
          type: "success",
          message: "Phone verified successfully.",
        });

        await SecureStore.setItemAsync("riderToken", res.data.token);
        await SecureStore.setItemAsync("riderRefreshToken", res.data.refreshToken);
        await SecureStore.setItemAsync("rider", JSON.stringify(res.data.rider));
        await SecureStore.setItemAsync("riderPhoneVerified", "true");
      } else {
        setOtpFeedback({
          type: "error",
          message: res.data?.message || "Invalid OTP.",
        });
      }
    } catch (err: any) {
      setOtpFeedback({
        type: "error",
        message: err?.response?.data?.message || "OTP verification failed.",
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return {
    isAuthenticated,
    phoneNumber,
    otp,
    otpSent,
    otpFeedback,
    isSendingOtp,
    isVerifyingOtp,
    otpCooldown,
    otpSendCount,
    MAX_OTP_REQUESTS,
    setPhoneNumber,
    setOtp,
    handleSendOtp,
    handleVerifyOtp,
  };
}

