import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "@/lib/apiClient";

interface Friend {
  _id: string;
  name: string;
  image?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

interface ChatState {
  friends: Friend[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  friends: [],
  loading: false,
  error: null
};

export const fetchFriends = createAsyncThunk(
  'chat/fetchFriends',
  async () => {
    const response = await apiClient.get('/api/chat/friends');
    return response.data;
  }
);

const chatSlice = createSlice({
  name: 'chatList',
  initialState,
  reducers: {
    updateFriendLastMessage: (state, action) => {
      const { friendId, lastMessage, lastMessageTime } = action.payload;
      const friendIndex = state.friends.findIndex(f => f._id === friendId);
      if (friendIndex !== -1) {
        state.friends[friendIndex] = {
          ...state.friends[friendIndex],
          lastMessage,
          lastMessageTime,
          unreadCount: (state.friends[friendIndex].unreadCount || 0) + 1
        };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriends.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFriends.fulfilled, (state, action: any) => {
        state.loading = false;
        state.friends = action.payload.friends;
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch friends';
      });
  }
});

export const { updateFriendLastMessage } = chatSlice.actions;
export const selectFriends = (state: { chatList: ChatState }) => state.chatList.friends;
export const selectLoading = (state: { chatList: ChatState }) => state.chatList.loading;

export default chatSlice.reducer;