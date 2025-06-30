import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/component/people/UserCard';
import { FetchFriends } from './friends-thunk';

interface FriendsState {
  peoples: User[];
  loading: boolean;
  error: string | null;
}

const initialState: FriendsState = {
  peoples: [],
  loading: false,
  error: null,
};

const FriendsState = createSlice({
  name: 'peoples',
  initialState,
  reducers: {
    // You can add manual reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(FetchFriends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(FetchFriends.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.peoples = action.payload;
      })
      .addCase(FetchFriends.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch people';
      });
  },
});

export default FriendsState.reducer;
