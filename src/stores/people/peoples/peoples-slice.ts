import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FetchPeoples } from './peoples-thunk';
import { User } from '@/component/people/UserCard';

interface PeopleState {
  peoples: User[];
  loading: boolean;
  error: string | null;
}

const initialState: PeopleState = {
  peoples: [],
  loading: false,
  error: null,
};

const peoplesSlice = createSlice({
  name: 'peoples',
  initialState,
  reducers: {
    // You can add manual reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(FetchPeoples.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(FetchPeoples.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.peoples = action.payload;
      })
      .addCase(FetchPeoples.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch people';
      });
  },
});

export default peoplesSlice.reducer;
