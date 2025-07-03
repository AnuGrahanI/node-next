import { createAsyncThunk,  } from '@reduxjs/toolkit';
import apiClient from '@/lib/apiClient';


interface RegisterPayload {
  fname: string;
  lname: string;
  email: string;
  username: string;
}



export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/api/auth/register', payload);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Something went wrong');
    }
  }
);
export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (payload: { email: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/api/auth/register/send-otp', payload);
      return response; 
    } catch (err: any) {
      console.log(err);
      
      return rejectWithValue(err.response?.message || err.message || 'Something went wrong');
    }
  }
);
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (payload: { email: string , otp: string}, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/api/auth/register/verify-otp', payload);
      return response; 
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Something went wrong');
    }
  }
);


