"use client";

import {
  Avatar,
  Box,
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Typography,
  Stack,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { useEffect, useState } from "react";
import PostScopeDropdown from "./sort-dropdown";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { fetchFeed, toggleLike } from "@/stores/posts/feeds/feed-thunk";
import { RootState } from "@/stores/store";
import { setScope } from "@/stores/posts/feeds/feed-slice";
import PostSkeleton from "../post-skeleton/PostSkeleton";
import { useRouter } from "next/navigation";

export interface FeedPostData {
  _id: string;
  user: { name: string; image: string, _id: string };
  createdAt: string;
  text: string;
  images: string[];
  liked: boolean;
  likesCount: number;
}

function PostCard({ post }: { post: FeedPostData }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user: author, createdAt, text, images, } = post;
  const [activeImg, setActiveImg] = useState(0);

  const next = () => setActiveImg((i) => (i < images.length - 1 ? i + 1 : i));
  const prev = () => setActiveImg((i) => (i > 0 ? i - 1 : i));
  const handleToggleLike = () => {
    dispatch(toggleLike({ postId: post._id }));
  };

  return (
    <Card sx={{ mb: 2, borderRadius: 3 }}>
      <CardHeader
        avatar={<Avatar src={author?.image} />}
        title={<Typography fontWeight={600} onClick={() => {router.push("/profile/"+author?._id)}}>{author?.name}</Typography>}
        subheader={<Typography variant="caption">{new Date(createdAt).toLocaleString()}</Typography>}
      />
      <CardContent sx={{ pt: 0 }}>
        {text && <Typography sx={{ mb: images.length ? 2 : 0 }}>{text}</Typography>}
        {images.length > 0 && (
          <Box sx={{ position: "relative", borderRadius: 2, overflow: "hidden" }}>
            <Box
              component="img"
              src={images[activeImg]}
              alt={`img-${activeImg}`}
              sx={{ width: "100%", height: 300, objectFit: "cover" }}
            />

            {images.length > 1 && (
              <>
                <IconButton
                  size="small"
                  onClick={prev}
                  disabled={activeImg === 0}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: 8,
                    transform: "translateY(-50%)",
                    backgroundColor: "rgba(0,0,0,0.4)",
                    color: "#fff",
                  }}
                >
                  <ArrowBackIosNewIcon fontSize="small" />
                </IconButton>

                <IconButton
                  size="small"
                  onClick={next}
                  disabled={activeImg === images.length - 1}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    right: 8,
                    transform: "translateY(-50%)",
                    backgroundColor: "rgba(0,0,0,0.4)",
                    color: "#fff",
                  }}
                >
                  <ArrowForwardIosIcon fontSize="small" />
                </IconButton>

                <Box
                  sx={{
                    position: "absolute",
                    bottom: 8,
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: 1,
                  }}
                >
                  {images.map((_, i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        backgroundColor:
                          i === activeImg ? "primary.main" : "grey.400",
                      }}
                    />
                  ))}
                </Box>
              </>
            )}
          </Box>
        )}

        <Stack direction="row" spacing={2} mt={2}>
        <Box sx={{ display: "flex", alignItems: "center",  }}>
            <IconButton size="small" onClick={handleToggleLike}>
            {post.liked ? (
              <FavoriteIcon fontSize="small" color="error" />
            ) : (
              <FavoriteBorderIcon fontSize="small" />
            )}
          </IconButton>
          <Typography variant="caption">{post.likesCount}</Typography>
        </Box>
          
          <IconButton size="small">
            <ChatBubbleOutlineIcon fontSize="small" />
          </IconButton>
          <IconButton size="small">
            <ShareIcon fontSize="small" />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
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
      <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
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
