import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { RootState } from '@/stores/store';
import { fetchUser } from '@/stores/user/profile/profile-thunk';
import { Box, Avatar, Typography, Skeleton, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react';

const ProfileSidebar = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.user);
  const { name, email, image: globalImage, friendsCount } = useAppSelector((state) => state.user.data);
  const [imagePreview, setImagePreview] = useState('');
   const posts = useAppSelector((state: RootState) => state.feeds.posts.length);

  useEffect(() => {
    if (globalImage) {
      setImagePreview(globalImage);
    }
  }, [globalImage]);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <Paper sx={{
      m: 1,
      bgcolor: 'background.paper',
      borderRadius: '12px',
      p: 3,
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      textAlign: 'center',
    }}>
      {/* Avatar with subtle shadow - Skeleton when loading */}
      {loading ? (
        <Skeleton
          variant="circular"
          width={96}
          height={96}
          sx={{
            margin: '0 auto 16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: '2px solid white'
          }}
        />
      ) : (
        <Avatar
          src={imagePreview || ""}
          alt={name}
          sx={{
            width: 96,
            height: 96,
            margin: '0 auto 16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: '2px solid white'
          }}
        />
      )}

      {/* Name with modern typography - Skeleton when loading */}
      {loading ? (
        <Skeleton
          variant="text"
          width="60%"
          height={32}
          sx={{ 
            margin: '0 auto 8px',
            borderRadius: '4px'
          }}
        />
      ) : (
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 700,
            mb: 0.5,
            color: 'text.primary',
            fontSize: '1.25rem'
          }}
        >
          {name}
        </Typography>
      )}

      {/* Email with subtle styling - Skeleton when loading */}
      {loading ? (
        <Skeleton
          variant="text"
          width="80%"
          height={24}
          sx={{ 
            margin: '0 auto 8px',
            borderRadius: '4px'
          }}
        />
      ) : (
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5
          }}
        >
          <Box component="span" sx={{ fontWeight: 500 }}>
            {email}
          </Box>
        </Typography>
      )}

      {/* Friend count with subtle styling - Skeleton when loading */}
      {loading ? (
        <Skeleton
          variant="text"
          width="40%"
          height={24}
          sx={{ 
            margin: '8px auto',
            borderRadius: '4px'
          }}
        />
      ) : (
       <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
  <Box sx={{ textAlign: 'center' }}>
    <Typography
      variant="h6"
      sx={{ fontWeight: 600, fontSize: '1.1rem', color: 'text.primary' }}
    >
      {friendsCount?.toLocaleString()}
    </Typography>
    <Typography
      variant="caption"
      sx={{ color: 'text.secondary', fontSize: '0.75rem' }}
    >
      Buddies
    </Typography>
  </Box>
  <Box sx={{ textAlign: 'center' }}>
    <Typography
      variant="h6"
      sx={{ fontWeight: 600, fontSize: '1.1rem', color: 'text.primary' }}
    >
      {posts?.toLocaleString()}
    </Typography>
    <Typography
      variant="caption"
      sx={{ color: 'text.secondary', fontSize: '0.75rem' }}
    >
      Posts
    </Typography>
  </Box>
</Box>

      )}

      {/* Subtle decorative element - Only show when not loading */}
      {!loading && (
        <Box sx={{ 
          height: '4px',
          width: '40px',
          bgcolor: 'primary.main',
          borderRadius: '2px',
          margin: '16px auto 0',
          opacity: 0.6
        }} />
      )}
    </Paper>
  );
};

export default ProfileSidebar;