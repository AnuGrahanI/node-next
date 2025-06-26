import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { resetPassword, sendOtp, verifyOtp } from "./forgot-password-thunk";

interface ForgotState {
  email: string;
  otpSent: boolean;
  verified: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: ForgotState = {
  email: "",
  otpSent: false,
  verified: false,
  loading: false,
  error: null,
};
const forgotPasswordSlice = createSlice({
  name: "forgot",
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    clearForgotState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOtp.pending, (state) => { state.loading = true; })
      .addCase(sendOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
        state.error = null;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to send OTP";
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.verified = true;
        state.error = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.error = action.error.message || "Invalid OTP";
      })
      .addCase(resetPassword.fulfilled, () => initialState)
      .addCase(resetPassword.rejected, (state, action) => {
        state.error = action.error.message || "Password reset failed";
      });
  },
});

export const { setEmail, clearForgotState } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
