import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/lib/apiClient';
import { FeedPostData } from '@/component/post/feed-posts/feed-posts';

interface FetchFeedArgs {
  scope: 'all' | 'my' | 'friends';
  page?: number;
  limit?: number;
}


export const fetchFeed = createAsyncThunk(
  'feed/fetchFeed',
  async (
    { scope, page = 1, limit = 10 }: FetchFeedArgs,
    { rejectWithValue }
  ) => {
    try {
      const { data } = await apiClient.get<FeedPostData[]>(
        `/api/posts/feeds`,
        { params: { scope, page, limit } }
      );
      return { posts: data, page };
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err.message || 'Failed to load feed';
      return rejectWithValue(message);
    }
  }
);


export const toggleLike = createAsyncThunk(
  "feed/toggleLike",
  async ({ postId }: { postId: string }, { rejectWithValue }) => {
    try {
      const data:any = await apiClient.post<{
  success: boolean;
  liked: boolean;
  likesCount: number;
}, void>(`/api/posts/${postId}/like`);
      return { postId, liked: data.liked, likesCount: data.likesCount };
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err.message || "Failed to toggle like";
      return rejectWithValue(msg);
    }
  }
);

export const fetchComments = createAsyncThunk(
  'feed/fetchComments',
  async ({ postId }: { postId: string }, { rejectWithValue }) => {
    try {
      const  data: any = await apiClient.get(`/api/posts/${postId}/comment`);
      return { postId, comments: data.comments };
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err.message || 'Failed to load comments';
      return rejectWithValue(message);
    }
  }
);

export const addComment = createAsyncThunk(
  'feed/addComment',
  async (
    { postId, text }: { postId: string; text: string },
    { rejectWithValue }

  ) => {
    console.log(text);
    
    try {
      const  data: any = await apiClient.post(`/api/posts/${postId}/comment`, {
        text,
      });

      return { postId, comment: data.comment };
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err.message || 'Failed to add comment';
      return rejectWithValue(message);
    }
  }
);