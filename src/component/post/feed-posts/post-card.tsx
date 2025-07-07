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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  useMediaQuery,
  Theme,
  SwipeableDrawer,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/stores/hooks";
import {  addComment, fetchComments, toggleLike } from "@/stores/posts/feeds/feed-thunk";
import { useRouter } from "next/navigation";
import { FeedPostData } from "./feed-posts";



export function PostCard({ post }: { post: FeedPostData }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  
  const { user: author, createdAt, text, images, comments } = post;
  const [activeImg, setActiveImg] = useState(0);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

  const next = () => setActiveImg((i) => (i < images.length - 1 ? i + 1 : i));
  const prev = () => setActiveImg((i) => (i > 0 ? i - 1 : i));
  
  const handleToggleLike = () => {
    dispatch(toggleLike({ postId: post._id }));
  };

  const toggleComments = () => {
    setCommentsOpen(!commentsOpen);
    if (!commentsOpen) {
      dispatch(fetchComments({ postId: post._id }));}
  };
   useEffect(() => {
    dispatch(fetchComments({ postId: post._id }));
  }, [dispatch, post._id]);

  const handleAddComment = () => {
        dispatch(addComment({ postId: post._id, text: commentText }));
        setCommentText('');
  };
  

  return (
    <Card sx={{ backgroundColor: 'background.paper', borderRadius: 0,borderBottom: '1px solid', borderColor: 'rgba(0, 0, 0, 0.12)'}}>
      <CardHeader
        avatar={<Avatar src={author?.image} />}
        title={
          <Typography 
            sx={{ cursor: "pointer" }} 
            fontWeight={600} 
            onClick={() => { router.push("/profile/" + author?._id) }}
          >
            {author?.name}
          </Typography>
        }
        subheader={
          <Typography variant="caption">
            {new Date(createdAt).toLocaleString()}
          </Typography>
        }
      />
      
      <CardContent sx={{ pt: 0 }}>
        {text && <Typography sx={{ mb: images.length ? 2 : 0 ,whiteSpace: 'pre-line' }}>{text}</Typography>}
        
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
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton size="small" onClick={handleToggleLike}>
              {post.liked ? (
                <FavoriteIcon fontSize="small" color="error" />
              ) : (
                <FavoriteBorderIcon fontSize="small" />
              )}
            </IconButton>
            <Typography variant="caption">{post.likesCount}</Typography>
          </Box>
          
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton size="small" onClick={toggleComments}>
              <ChatBubbleOutlineIcon fontSize="small" />
            </IconButton>
            <Typography variant="caption">{comments.length}</Typography>
          </Box>
          
          <IconButton size="small">
            <ShareIcon fontSize="small" />
          </IconButton>
        </Stack>

        {/* Comments Section - Accordion for desktop */}
        {!isMobile && (
          <Accordion 
            expanded={commentsOpen} 
            onChange={toggleComments}
            sx={{ 
              boxShadow: 'none',
              '&:before': {
                display: 'none',
              },
              mt: 1,
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                minHeight: 'auto !important',
                height: '32px !important',
                '& .MuiAccordionSummary-content': {
                  margin: '0 !important',
                },
                display: commentsOpen ? 'none' : 'flex',
                p: 0,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                View {comments.length} comments
              </Typography>
            </AccordionSummary>
            
            <AccordionDetails sx={{ p: 0, pt: 1 }}>
              <List sx={{ width: '100%', maxHeight: 300, overflow: 'auto' }}>
                {comments.map((comment) => (
                  <div key={comment._id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar src={comment?.user?.image} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography 
                              fontWeight={600} 
                              sx={{ cursor: 'pointer' }}
                              onClick={() => router.push("/profile/" + comment.user._id)}
                            >
                              {comment.user?.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                            {comment.text}
                            
                          </Typography>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                  </div>
                ))}
              </List>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  multiline
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                //   onKeyPress={(e) => {
                //     if (e.key === 'Enter') {
                //       handleAddComment();
                //     }
                //   }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault(); // Prevent newline
                    handleAddComment();
                    }
                }}
                />
                <IconButton onClick={handleAddComment} disabled={!commentText.trim()}>
                  <SendIcon />
                </IconButton>
              </Box>
            </AccordionDetails>
          </Accordion>
        )}
      </CardContent>

      {/* Comments Drawer for mobile */}
      <SwipeableDrawer
        anchor="bottom"
        open={isMobile && commentsOpen}
        onClose={toggleComments}
        onOpen={toggleComments}
        disableSwipeToOpen={false}
        // open={isMobile && commentsOpen}
        // onClose={toggleComments}
        sx={{
          '& .MuiDrawer-paper': {
            // height: '70vh',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1">Comments</Typography>
            <IconButton onClick={toggleComments}>
              <ExpandMoreIcon />
            </IconButton>
          </Box>
          
          <List sx={{ width: '100%', maxHeight: 'calc(70vh - 120px)', overflow: 'auto',p:0 }}>
            {comments.map((comment) => (
              <div key={comment._id}>
                <ListItem sx={{p:0,pb:1}} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar src={comment?.user?.image} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center',justifyContent:'space-between', gap: 1,mb:1 }}>
                        <Typography 
                          sx={{ cursor: 'pointer',fontSize:'.7rem' }}
                          onClick={() => router.push("/profile/" + comment.user?._id)}
                        >
                          {comment.user?.name}
                        </Typography>
                        <Typography sx={{fontSize:'.65rem'}} variant="caption" color="text.secondary">
                          {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" sx={{fontSize:'.7rem'}}>
                        {comment.text}
                      </Typography>
                    }
                  />
                </ListItem>
                {/* <Divider component="li" /> */}
              </div>
            ))}
          </List>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddComment();
                }
              }}
            />
            <IconButton onClick={handleAddComment} disabled={!commentText.trim()}>
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </SwipeableDrawer>
    </Card>
  );
}