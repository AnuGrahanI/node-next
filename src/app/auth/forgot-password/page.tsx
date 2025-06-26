"use client";

import { sendOtp, verifyOtp,resetPassword } from "@/stores/auth/forgot-password/forgot-password-thunk";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { Box, TextField, Button, Typography, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useRef } from "react";


export default function ForgotPasswordPage() {
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const dispatch = useAppDispatch();
  const { email, otpSent, verified, loading } = useAppSelector((state) => state.forgotpassword);
  const [password, setPassword] = useState("");
  const handleSendOtp = () => dispatch(sendOtp(email));
  const handleVerifyOtp = () => dispatch(verifyOtp({ email, otp }));
  const handleResetPassword = () => dispatch(resetPassword({ email, password }));
  const handleOtpChange = (index: number, value: string) => {
  if (!/^\d?$/.test(value)) return; // Only allow 1 digit

  const newOtp = [...otpDigits];
  newOtp[index] = value;
  setOtpDigits(newOtp);

  // Auto-focus next input
  if (value && index < 5) {
    inputsRef.current[index + 1]?.focus();
  }
};
const handleBackspace = (index: number, e: React.KeyboardEvent) => {
  if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
    inputsRef.current[index - 1]?.focus();
  }
};
const otp = otpDigits.join(""); // Combine for submission


  return (
    <Box>
      <Typography variant="h5" mb={2}>Forgot Password</Typography>
      <TextField label="Email Address" value={email} onChange={(e) => dispatch({ type: 'forgotpassword/set_email', payload: e.target.value })} fullWidth />

      {!otpSent ? (
        <Button onClick={handleSendOtp} disabled={loading}>
          {loading ? <CircularProgress size={20} /> : "Send OTP"}
        </Button>
      ) : !verified ? (
        <>
          <Box display="flex" gap={1} justifyContent="center" mb={2}>
  {otpDigits.map((digit, i) => (
    <TextField
      key={i}
      inputRef={(el) => (inputsRef.current[i] = el)}
      value={digit}
      onChange={(e) => handleOtpChange(i, e.target.value)}
      onKeyDown={(e) => handleBackspace(i, e)}
      inputProps={{
        maxLength: 1,
        style: {
          textAlign: "center",
          fontSize: "1.5rem",
          width: "3rem",
          height: "3.5rem",
        },
      }}
    />
  ))}
</Box>
<Button onClick={handleVerifyOtp} disabled={loading}>
  {loading ? <CircularProgress size={20} /> : "Verify OTP"}
</Button>

        </>
      ) : (
        <>
          <TextField label="New Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
          <Button onClick={handleResetPassword} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : "Reset Password"}
          </Button>
        </>
      )}
    </Box>
  );
}
