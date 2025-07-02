// stores/user/user-profile-thunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/lib/apiClient";

export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (userId: string, { rejectWithValue }) => {
    try {
      const { data: response }: any = await apiClient.get(`/api/user/${userId}`);
      return response; 
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to fetch user");
    }
  }
);
