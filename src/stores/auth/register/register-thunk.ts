import { createAsyncThunk,  } from '@reduxjs/toolkit';
import api from '@/lib/apiClient';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}



export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/register', payload);
      return response.message;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Something went wrong');
    }
  }
);
