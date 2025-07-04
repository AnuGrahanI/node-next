import { createAsyncThunk } from '@reduxjs/toolkit';
import { PeopleItem, PeopleQuery } from './people-slice';
import apiClient from '@/lib/apiClient';

export const fetchPeople = createAsyncThunk<
  { rows: PeopleItem[]; totalPages: number },
  PeopleQuery
>('people/fetchPeople', async (query, { rejectWithValue }) => {
  try {
    const { filter, search, page, limit } = query;
    const encodedSearch = encodeURIComponent(search || 'null');
    const url = `/api/people/${filter}/${encodedSearch}/${page}/${limit}`;

    const res: any = await apiClient.get(url, { cache: 'no-store' } as any);
 

    if (!res.success) throw new Error(res.message);
    return { rows: res.data, totalPages: res.totalPages };
  } catch (err: any) {
    return rejectWithValue(err.message ?? 'Fetch error');
  }
});
