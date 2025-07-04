import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchFeed, fetchComments, addComment, toggleLike } from './feed-thunk';
import { FeedPostData } from '@/component/post/feed-posts/feed-posts';

interface FeedState {
  posts: FeedPostData[];
  scope: 'all' | 'my' | 'friends';
  page: number;
  loading: boolean;
  error: string | null;
}

const initialState: FeedState = {
  posts: [],
  scope: 'all',
  page: 1,
  loading: false,
  error: null,
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setScope(state, action: PayloadAction<'all' | 'my' | 'friends'>) {
      state.scope = action.payload;
      state.page = 1;
      state.posts = [];
    },
    clearFeed(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Feed
      .addCase(fetchFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.page = action.payload.page;
        state.posts =
          action.payload.page === 1
            ? action.payload.posts
            : [...state.posts, ...action.payload.posts];
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Toggle Like
      .addCase(toggleLike.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p._id === action.payload.postId);
        if (post) {
          post.liked = action.payload.liked;
          post.likesCount = action.payload.likesCount;
        }
      })

      // Fetch Comments
      .addCase(fetchComments.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p._id === action.payload.postId);
        if (post) {
          post.comments = action.payload.comments;
        }
      })

      // Add Comment
      .addCase(addComment.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p._id === action.payload.postId);
        if (post) {
          post.comments.unshift(action.payload.comment); // Add to top
        }
      });
  },
});

export const { setScope, clearFeed } = feedSlice.actions;

export default feedSlice.reducer;