
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function useOtpVerification() {
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
      const token = await SecureStore.getItemAsync("token");
      const user = await SecureStore.getItemAsync("user");

      if (token && user) {
        setIsAuthenticated(true);
        setPhoneNumber(JSON.parse(user).phoneNumber); // optional
      }
    };
    loadAuthState();
  }, []);

  // ---------------------------
  // SEND OTP
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
      const res = await api.post("/users/send-otp", { phoneNumber });

      if (res.data?.success) {
        console.log(res.data)
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
      console.log(err)
      setOtpFeedback({
        type: "error",
        message: err?.response?.data?.message || "Failed to send OTP.",
      });
    } finally {
      setIsSendingOtp(false);
    }
  };

  // ---------------------------
  // VERIFY OTP
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
      const res = await api.post("/users/verify-otp", {
        phoneNumber,
        otp,
      });

      if (res.data?.success) {
        console.log(res.data)
        setIsAuthenticated(true);
        setOtp("");
        setOtpSent(false);
        setOtpFeedback({
          type: "success",
          message: "Phone verified successfully.",
        });


        // Persist token, refresh token, and maybe user info
        await SecureStore.setItemAsync("token", res.data.token);
        await SecureStore.setItemAsync("refreshToken", res.data.refreshToken);
        await SecureStore.setItemAsync("user", JSON.stringify(res.data.user));
        await SecureStore.setItemAsync("phoneVerified", "true"); // optional flag
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
