// store/peopleSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchPeople } from './people-thunk';

export type PeopleItem = {
  id: string;
  username: string;
  name: string;
  image?: string;
  isFriend: boolean;
  isFollowing: boolean;
  hasSentMeRequest: boolean;
};

export type PeopleQuery = {
  search: string;
  filter: 'all' | 'friends' | 'sent' | 'received';
  page:   number;
  limit:  number;
};

interface PeopleState extends PeopleQuery {
  rows: PeopleItem[];
  totalPages: number;
  loading: boolean;
  error: string | null;
}

const initialState: PeopleState = {
  search: '',
  filter: 'all',
  page: 1,
  limit: 12,
  rows: [],
  totalPages: 1,
  loading: false,
  error: null,
};

const peopleSlice = createSlice({
  name: 'people',
  initialState,
  reducers: {
    setSearch(state, { payload }: PayloadAction<string>) {
      state.search = payload;
      state.page = 1;          // reset to first page
    },
    setFilter(state, { payload }: PayloadAction<PeopleState['filter']>) {
      state.filter = payload;
      state.page = 1;
    },
    setPage(state, { payload }: PayloadAction<number>) {
      state.page = payload;
    },
    clearError(state) {
      state.error = null;
    },
    patchPerson(state, action: PayloadAction<{ id: string; patch: Partial<PeopleItem> }>) {
    const idx = state.rows.findIndex(u => u.id === action.payload.id);
    if (idx !== -1) {
      state.rows[idx] = { ...state.rows[idx], ...action.payload.patch };
    }
  },
  },
  extraReducers: builder =>
    builder
      .addCase(fetchPeople.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPeople.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.rows = payload.rows;
        state.totalPages = payload.totalPages;
      })
      .addCase(fetchPeople.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      }),
});

export const { setSearch, setFilter, setPage, clearError , patchPerson} = peopleSlice.actions;
export default peopleSlice.reducer;
