"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Box,
  // Switch,
  Tooltip,
  useColorScheme,
} from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";



export default function Header() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { mode, setMode } = useColorScheme();
  const router = useRouter();
  


  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    router.push("/profile/update");
    handleMenuClose();
  };
  const handleLogout = () => {
    sessionStorage.clear();
    authClient.signOut();
    handleMenuClose();
  };

  return (
    <AppBar position="static" color="primary" sx={{
      position:'sticky !important',
      top:0,
      zIndex:1000
    }}>
      <Toolbar>
        
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          PE’ZU	
        </Typography>

        {/* Theme toggle */}
        <Tooltip title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}>
          <IconButton onClick={()=>{setMode(mode === "dark" ? "light" : "dark")}} color="inherit">
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Tooltip>

        {/* Profile menu */}
        <Box ml={2}>
          <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
            <Avatar sx={{ bgcolor: deepPurple[500] }}>A</Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleProfile}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

