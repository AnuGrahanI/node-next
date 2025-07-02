// stores/posts/create-post-thunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/lib/apiClient';


interface CreatePostPayload {
  text: string;
  images: File[];      // <‑‑ keep them as File objects
}


export const createPost = createAsyncThunk(
  'posts/create',
  async ({ text, images }: CreatePostPayload, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('text', text);
      images.forEach(img => formData.append('images', img));

      const { message } = await apiClient.post('/api/posts/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return  message;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err.message || 'Failed to create post';
      return rejectWithValue(message);  // ➡️  action.payload in rejected case
    }
  }
);
