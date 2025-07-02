import { User } from '@/component/people/UserCard';
import apiClient from '@/lib/apiClient';
import { createAsyncThunk } from '@reduxjs/toolkit';
interface SendRequest {
    recipientId:string
}

export const FetchPeoples = createAsyncThunk<User[]>(
  'people/FetchPeoples',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get('/api/people/peoples');
      return res.data as User[];
    } catch (err: any) {
      return rejectWithValue(err.message || 'Something went wrong');
    }
  }
);


export const sendRequest = createAsyncThunk(
  'people/sendrequest',
  async (recipientId: SendRequest, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/api/people/peoples/send-request', recipientId);
      return response.message;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Something went wrong');
    }
  }
);
export const cancelRequest = createAsyncThunk(
  'people/cancelrequest',
  async (recipientId: SendRequest, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete('/api/people/peoples/cancel-request', {
        data: recipientId,
      });
      return response.message;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Something went wrong');
    }
  }
);

