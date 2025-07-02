import PostCreate from '@/component/post/create-post/create-post'
import FeedPost from '@/component/post/feed-posts/feed-posts'
import { Box, Grid } from '@mui/material';
import React from 'react'

const page = () => {
  return (
    <>
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 12, md: 8}} >
         <PostCreate/>
          <FeedPost  />
        </Grid>
      <Grid size={{ xs: 0, sm: 0, md: 4}}>
        <Box>ji</Box>
        </Grid>
      </Grid>
   
    
    </>
  )
}

export default page