import apiClient from '@/lib/apiClient';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {

  try {
    const res = await apiClient.get('/api/user');
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Something went wrong');

  }
});

// Thunk to update user profile
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await apiClient.put('/api/user', formData,
         { headers: { 'Content-Type': 'multipart/form-data' } });

      return res.message;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Something went wrong');
    }
  }
);


