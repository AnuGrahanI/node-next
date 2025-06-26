"use client"
import ProfilePage from '@/component/profile/profile'
import { authClient } from '@/lib/auth/auth-client'
import { Box } from '@mui/system'
import React from 'react'

const page = () => {
  return (
    <Box>
      <ProfilePage/>
    </Box>
  )
}

export default page