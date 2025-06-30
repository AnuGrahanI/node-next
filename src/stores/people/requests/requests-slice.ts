import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/component/people/UserCard';
import { FetchRequests } from './requests.thunk';

interface RequestsState {
  peoples: User[];
  loading: boolean;
  error: string | null;
}

const initialState: RequestsState = {
  peoples: [],
  loading: false,
  error: null,
};

const requestsSlice = createSlice({
  name: 'peoples',
  initialState,
  reducers: {
    // You can add manual reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(FetchRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(FetchRequests.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.peoples = action.payload;
      })
      .addCase(FetchRequests.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch people';
      });
  },
});

export default requestsSlice.reducer;
