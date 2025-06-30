import { User } from '@/component/people/UserCard';
import apiClient from '@/lib/apiClient';
import { createAsyncThunk } from '@reduxjs/toolkit';
interface UnfriendAction {
    friendId:string
}

export const FetchFriends = createAsyncThunk<User[]>(
  'requests/FetchFriends',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get('/api/people/friends');
      return res.data as User[];
    } catch (err: any) {
      return rejectWithValue(err.message || 'Something went wrong');
    }
  }
);

export const UnfriendAction = createAsyncThunk(
  'people/UnfriendAction',
  async ({ friendId }: UnfriendAction, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/api/people/friends/unfriend', { friendId});
      return response.message;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Something went wrong');
    }
  }
);