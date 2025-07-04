"use client";

import {
  Box,
  Typography,
  Stack,
  
} from "@mui/material";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { fetchFeed } from "@/stores/posts/feeds/feed-thunk";
import { RootState } from "@/stores/store";
import { setScope } from "@/stores/posts/feeds/feed-slice";
import PostScopeDropdown from "./sort-dropdown";
import PostSkeleton from "../post-skeleton/PostSkeleton";
import { PostCard } from "./post-card";
export interface CommentUser {
  _id: string;
  name: string;
  image?: string;
}

export interface Comment {
  _id: string;
  user: CommentUser;
  text: string;
  createdAt: string;
}
export interface FeedPostData {
  _id: string;
  user: { name: string; image: string, _id: string };
  createdAt: string;
  text: string;
  images: string[];
  liked: boolean;
  likesCount: number;
  comments: Comment[];
  length: number;
}

export default function Feed() {
    const dispatch = useAppDispatch();

  const { posts, scope, loading } = useAppSelector(
    (state: RootState) => state.feeds      
  );

  /** dropdown callback */
  const handleScopeChange = (s: "all" | "my" | "friends") => {
    dispatch(setScope(s));             
  };


  const fetchPosts = () => {
    dispatch(fetchFeed({ scope, page: 1, limit: 10 }));
  };

  useEffect(() => {
    fetchPosts();
  }, [scope, dispatch]);

  return (
    <Box mx="auto">
      <Stack direction="row" alignItems="center" sx={{backgroundColor:'background.paper',}}>
        <PostScopeDropdown scope={scope} onChange={handleScopeChange}  />
      </Stack>

      {loading && (
        <PostSkeleton/>
      )}

      {posts.length === 0 && (
        <Typography variant="body2" color="text.secondary" textAlign="center">
          No posts to show.
        </Typography>
      )}

      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </Box>
  );
}