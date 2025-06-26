import { createAsyncThunk } from "@reduxjs/toolkit";
import api from '@/lib/apiClient';




export const sendOtp = createAsyncThunk(
  'forgot/sendOtp',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/auth/forgot-password/send-otp", { email });
      return response.message;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Something went wrong');
    }
  }
);
export const verifyOtp = createAsyncThunk(
  'forgot/verifyOtp',
  async ({ email, otp }: { email: string, otp: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/auth/forgot-password/verify", { email, otp });
      return response.message;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Something went wrong');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'forgot/resetPassword',
  async ({ email, password }: { email: string, password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/auth/forgot-password/reset", { email, password });
      return response.message;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Something went wrong');
    }
  }
);
