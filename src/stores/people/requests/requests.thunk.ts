import { User } from '@/component/people/UserCard';
import apiClient from '@/lib/apiClient';
import { createAsyncThunk } from '@reduxjs/toolkit';
interface RequestAction {
    requestorId:string
    action:'accept' | 'reject'
}

export const FetchRequests = createAsyncThunk<User[]>(
  'requests/FetchRequests',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get('/api/people/requests');
      return res.data as User[];
    } catch (err: any) {
      return rejectWithValue(err.message || 'Something went wrong');
    }
  }
);


export const RequestAction = createAsyncThunk(
  'people/RequestAction',
  async ({ requestorId , action}: RequestAction, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/api/people/requests/${action}`, {
        requestorId,
      });      return response;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Something went wrong');
    }
  }
);
