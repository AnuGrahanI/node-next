"use client"
import React, { useEffect, useState, useRef } from 'react';
import { Box, TextField, Button, Avatar, CircularProgress } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { fetchUser, updateUser } from '@/stores/user/profile/profile-thunk';
import Image from 'next/image';

export const avatarStyle = {
  cursor: "pointer",
  width: { xs: "80px", sm: "100px" },
  height: { xs: "80px", sm: "100px" },
  position: "relative",
  overflow: "hidden",
  backgroundColor: "transparent",
  "&:hover .upload-text": {
    opacity: 1,
  },
};



export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.user);
  const { name, email, image: globalImage } = useAppSelector((state) => state.user.data);
  const [names, setName] = useState('');
  const [emails, setEmail] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [editMode, setEditMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    setName(name);
  }, [name]);

  useEffect(() => {
    setEmail(email);
  }, [email]);

  useEffect(() => {
    setImagePreview(globalImage);
  }, [globalImage]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarClick = () => {
    if (editMode) {
      fileInputRef.current?.click();
    }
  };

  const handleSubmit = async () => {
    if (!editMode) {
      setEditMode(true);
      return;
    }
    const formData = new FormData();
    formData.append('name', names);
    formData.append('email', emails);
    if (imageFile) {
      formData.append('image', imageFile);
    }
    try {
      await dispatch(updateUser(formData));
      setEditMode(false);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setName(name);
    setEmail(email);
    setImagePreview(globalImage);
    setImageFile(null);
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Box sx={{ position: 'relative', width: { xs: 80, sm: 100 }, mx: 'auto','&:hover .upload-text': {
          opacity: 1,
        }, }}>
  <Avatar
    src={imagePreview}
    sx={{
      width: { xs: 80, sm: 100 },
      height: { xs: 80, sm: 100 },
      cursor: editMode ? 'pointer' : 'default',
    }}
    onClick={handleAvatarClick}
  />
  {editMode && (
    <Box
      className="upload-text"
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: 'white',
        textAlign: 'center',
        fontSize: '14px',
        opacity: 0,
        pointerEvents: 'none',
        py: 0.5,
        transition: 'opacity 0.3s',
        display: 'flex', alignItems: 'center', gap: 1,justifyContent:'center',
        height:'100%',
        borderRadius:'50%'
      }}
    >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1,height:'fit-content',}}>
        <Image
                src={"/assets/icons/upload-icon.svg"}
                alt="Upload Icon"
                width={20}
                height={20}
              />
              </Box>
      Upload
    </Box>
  )}
  <input
    type="file"
    accept="image/*"
    ref={fileInputRef}
    style={{ display: 'none' }}
    onChange={handleImageChange}
  />

  <input
    type="file"
    accept="image/*"
    ref={fileInputRef}
    style={{ display: 'none' }}
    onChange={handleImageChange}
  />
</Box>

      <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageChange} />
      <TextField fullWidth label="Name" value={names} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} margin="normal" disabled={!editMode} />
      <TextField fullWidth label="Email" value={emails} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} margin="normal" disabled={!editMode} />
      <Button fullWidth variant="contained" color={editMode ? 'primary' : 'secondary'} onClick={handleSubmit} disabled={loading} sx={{ mt: 2 }}>
        {loading ? <CircularProgress size={24} /> : editMode ? 'Save Changes' : 'Edit Profile'}
      </Button>
      {editMode && (
        <Button fullWidth variant="outlined" color="secondary" onClick={handleCancel} sx={{ mt: 1 }}>
          Cancel
        </Button>
      )}
    </Box>
  );
}
