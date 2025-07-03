"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  Typography,
  Paper,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import {
  fetchUser,
  updateUser,
} from "@/stores/user/profile/profile-thunk";
import Image from "next/image";

/* ---------- styles shared by avatar & cover ---------- */
const hoverOverlaySx = {
  position: "absolute",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 14,
  opacity: 0,
  transition: "opacity 0.3s",
  pointerEvents: "none",
};

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.user);
  const {
    name,
    email,
    bio,
    image: globalAvatar,
    cover: globalCover,   
  } = useAppSelector((state) => state.user.data);

  /* -------------------- local state ------------------- */
  const [names, setName] = useState("");
  const [emails, setEmail] = useState("");
  const [bios, setBio] = useState("");

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [editMode, setEditMode] = useState(false);

  /* -------------------- refs -------------------------- */
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  /* -------------------- effects ----------------------- */
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => setName(name), [name]);
  useEffect(() => setEmail(email), [email]);
  useEffect(() => setBio(bios), [bio]);
  useEffect(() => setAvatarPreview(globalAvatar), [globalAvatar]);
  useEffect(() => setCoverPreview(globalCover), [globalCover]);

  /* -------------------- file handlers ----------------- */
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  /* -------------------- click targets ----------------- */
  const handleAvatarClick = () => {
    if (editMode) avatarInputRef.current?.click();
  };

  const handleCoverClick = () => {
    if (editMode) coverInputRef.current?.click();
  };

  /* -------------------- form actions ------------------ */
  const handleSubmit = async () => {
    if (!editMode) {
      setEditMode(true);
      return;
    }

    const formData = new FormData();
    formData.append("name", names);
    formData.append("email", emails);
    formData.append("bio", bios);
    if (avatarFile) formData.append("image", avatarFile);
    if (coverFile) formData.append("cover", coverFile);

    try {
      await dispatch(updateUser(formData));
      setEditMode(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setName(name);
    setEmail(email);
    setBio(bio);
    setAvatarPreview(globalAvatar);
    setCoverPreview(globalCover);
    setAvatarFile(null);
    setCoverFile(null);
  };

  /* ================== render =================== */
  return (
    <Paper sx={{ maxWidth: 400, p: 2, position: "relative" }}>
      {/* -------- profile header / cover -------- */}
      <Box
        sx={{
          width: "100%",
          height: 120,
          backgroundColor: "#f5f5f5",
          backgroundImage: `url(${coverPreview})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: 1,
          cursor: editMode ? "pointer" : "default",
          position: "relative",
          mb: 4,
          overflow: "hidden",
          "&:hover .cover-upload": { opacity: 1 },
        }}
        onClick={handleCoverClick}
      >
        {editMode && (
          <Box className="cover-upload" sx={hoverOverlaySx}>
            <Image
              src="/assets/icons/upload-icon.svg"
              alt="Upload cover"
              width={20}
              height={20}
            />
            <Box component="span" ml={0.5}>
              Upload
            </Box>
          </Box>
        )}
        <input
          type="file"
          accept="image/*"
          ref={coverInputRef}
          style={{ display: "none" }}
          onChange={handleCoverChange}
        />
      </Box>

      {/* --------------- avatar --------------- */}
      <Box
        sx={{
          position: "relative",
          width: { xs: 80, sm: 100 },
          mx: "auto",
          mt: -10,
          mb: 2,
          "&:hover .avatar-upload": { opacity: 1 },
        }}
      >
        <Avatar
          src={avatarPreview}
          sx={{
            width: { xs: 80, sm: 100 },
            height: { xs: 80, sm: 100 },
            cursor: editMode ? "pointer" : "default",
            border: "2px solid white",
          }}
          onClick={handleAvatarClick}
        />
        {editMode && (
          <Box className="avatar-upload" sx={{ ...hoverOverlaySx, borderRadius: "50%" }}>
            <Image
              src="/assets/icons/upload-icon.svg"
              alt="Upload avatar"
              width={20}
              height={20}
            />
          </Box>
        )}
        <input
          type="file"
          accept="image/*"
          ref={avatarInputRef}
          style={{ display: "none" }}
          onChange={handleAvatarChange}
        />
      </Box>

      {/* --------------- profile fields --------------- */}
      <Box>
        <Typography variant="subtitle2">Name</Typography>
        <TextField
          fullWidth
          value={names}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          margin="normal"
          disabled={!editMode}
        />
      </Box>
      <Box>
        <Typography variant="subtitle2">Email</Typography>
        <TextField
          fullWidth
          value={emails}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          margin="normal"
          disabled={!editMode}
        />
      </Box>
      <Box>
        <Typography variant="subtitle2">Bio</Typography>
        <TextField
          fullWidth
          value={bios}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBio(e.target.value)}
          margin="normal"
          disabled={!editMode}
        />
      </Box>

      {/* --------------- action buttons --------------- */}
      <Button
        fullWidth
        variant="contained"
        color={editMode ? "primary" : "secondary"}
        onClick={handleSubmit}
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? (
          <CircularProgress size={24} />
        ) : editMode ? (
          "Save Changes"
        ) : (
          "Edit Profile"
        )}
      </Button>
      {editMode && (
        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          onClick={handleCancel}
          sx={{ mt: 1 }}
        >
          Cancel
        </Button>
      )}
    </Paper>
  );
}
