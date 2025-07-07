// app/(pages)/home/page.tsx
"use client";

import React, { useRef } from "react";
import { Grid } from "@mui/material";
import ScrollTopFab from "@/component/layout/scroll-top-fab/scrollTopFab";
import PostCreate, {
  PostCreateHandle,
} from "@/component/post/create-post/create-post";
import FeedPost from "@/component/post/feed-posts/feed-posts";

const HomePage = () => {
  const postCreateRef = useRef<PostCreateHandle>(null);

  const openComposer = () => {
    document
      .getElementById("post-create-anchor")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });

    setTimeout(() => postCreateRef.current?.focusInput(), 400);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <PostCreate ref={postCreateRef} />
          <FeedPost />
        </Grid>
        <Grid size={{ xs: 0, md: 4 }}  />
      </Grid>

      <ScrollTopFab onActivate={openComposer} />
    </>
  );
};

export default HomePage;
