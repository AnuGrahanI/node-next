// stores/user/user-profile-slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchUserProfile } from "./profiles-thunk";

interface UserProfileData {
  id: string;
  name: string;
  image: string;
  cover: string;
  bio?: string;
  posts: any[];
  friends: string[];
  isMe: boolean;
  relationshipStatus: "follow" | "sentRequest" | "acceptRequest" | "following";
}

interface UserProfileState {
  loading: boolean;
  error: string | null;
  data: UserProfileData;
}

const initialState: UserProfileState = {
  loading: false,
  error: null,
  data: {
    id: "",
    name: "",
    image: "",
    cover: "",
    bio: "",
    posts: [],
    friends: [],
    isMe: false,
    relationshipStatus: "follow", // default
  },
};

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    clearUserProfile(state) {
      state.loading = false;
      state.data = initialState.data;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<UserProfileData>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUserProfile } = userProfileSlice.actions;
export default userProfileSlice.reducer;
