import { FeedPostData } from '@/component/post/feed-posts/feed-posts';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchFeed } from './feed-thunk';
import { toggleLike } from './feed-thunk';


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
    /** e.g. user tapped the dropdown */
    setScope(state, action: PayloadAction<'all' | 'my' | 'friends'>) {
      state.scope = action.payload;
      state.page = 1;
      state.posts = []; // clear when scope changes
    },
    clearFeed(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchFeed.fulfilled,
        (
          state,
          action: PayloadAction<{ posts: FeedPostData[]; page: number }>
        ) => {
          state.loading = false;
          state.page = action.payload.page;
          // replace or append depending on page
          state.posts =
            action.payload.page === 1
              ? action.payload.posts
              : [...state.posts, ...action.payload.posts];
        }
      )
      .addCase(fetchFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
      const post = state.posts.find((p) => p._id === action.payload.postId);
      if (post) {
        post.liked = action.payload.liked;
        post.likesCount = action.payload.likesCount;
      }
    });
      
  },
});

export const { setScope, clearFeed } = feedSlice.actions;

export default feedSlice.reducer;
