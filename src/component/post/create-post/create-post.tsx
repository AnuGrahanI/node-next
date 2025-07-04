"use client";

import {
  Avatar,
  Box,
  Button,
  IconButton,
  InputBase,
  Stack,
  Typography,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { createPost } from "@/stores/posts/create/create-post";

export default function PostCreate() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [fileObjs, setFileObjs] = useState<File[]>([]);
    const { image } = useAppSelector((state) => state.user.data);
  

  const maxImages = 2;
  const dispatch = useAppDispatch();


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || []);
  const addable = files.slice(0, maxImages - images.length);

  // previews
  const newUrls = addable.map(f => URL.createObjectURL(f));
  setImages(prev => [...prev, ...newUrls]);

  // actual files for upload
  setFileObjs(prev => [...prev, ...addable]);

  if (activeIndex >= images.length - 1) setActiveIndex(images.length);
};


  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    if (activeIndex >= updated.length) {
      setActiveIndex(Math.max(0, updated.length - 1));
    }
  };

  const handlePost = () => {
      dispatch(createPost({ text, images: fileObjs }))
      .unwrap()             
      .then(() => {
      setText('');
      setImages([]);
      setFileObjs([]);
      setActiveIndex(0);
    })
    .catch((err) => {
      // ❌ you can surface toast/snackbar here
      console.error(err);
    });

  };

  const handleNext = () => {
    if (activeIndex < images.length - 1) setActiveIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (activeIndex > 0) setActiveIndex((prev) => prev - 1);
  };

  return (
    <Box
      sx={{
        p: 2,
        mx: "auto",
        borderBottom: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
      }}
    >
      <Stack direction="row" spacing={2}>
        <Avatar src={image} />
        <Box sx={{ flex: 1 }}>
          <InputBase
            placeholder="What's on your mind?"
            multiline
            fullWidth
            value={text}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
            sx={{
              fontSize: "1rem",
              px: 1,
              py: 1,
              borderRadius: 2,
              mb: 1,
              border: "1px solid",
              borderColor: "divider",
            }}
          />

          {images.length > 0 && (
            <Box
              sx={{
                position: "relative",
                mt: 1,
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <Box
                component="img"
                src={images[activeIndex]}
                alt={`preview-${activeIndex}`}
                sx={{
                  width: "100%",
                  height: 250,
                  objectFit: "cover",
                  borderRadius: 2,
                }}
              />

              <IconButton
                size="small"
                onClick={() => handleRemoveImage(activeIndex)}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  color: "#fff",
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>

              {images.length > 1 && (
                <>
                  <IconButton
                    size="small"
                    onClick={handlePrev}
                    disabled={activeIndex === 0}
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
                    onClick={handleNext}
                    disabled={activeIndex === images.length - 1}
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
                </>
              )}

              {/* Dots Indicator */}
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
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: i === activeIndex ? "primary.main" : "grey.400",
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton
                sx={{borderRadius: 1}}
                onClick={() => fileRef.current?.click()}
                size="small"
                disabled={images.length >= maxImages}
              >
                <ImageIcon color={images.length >= maxImages ? "disabled" : "primary"} />
              </IconButton>
              {images.length > 0 && (
                    <Typography
                        variant="body2"
                        color={images.length >= maxImages ? "text.disabled" : "text.secondary"}
                    >
                        {images.length >= maxImages
                        ? `Max ${maxImages} images`
                        : `${images.length}/${maxImages} uploaded`}
                    </Typography>
                    )}
            </Stack>

            <Button
              onClick={() => handlePost()}
              disabled={!text && images.length === 0}
              variant="contained"
              size="small"
              sx={{ borderRadius: 5, textTransform: "none", px: 3 }}
            >
              Post
            </Button>
          </Stack>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleImageChange}
          />
        </Box>
      </Stack>
    </Box>
  );
}
