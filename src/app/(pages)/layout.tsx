'use client';

import { ReactNode, useState } from "react";
import { AuthGuard } from '@/component/auth/guards/auth-guard';
import { Box, Drawer } from '@mui/material';
import Header from "@/component/layout/header/header";
import Sidebar from "@/component/layout/sidebar/sidebar";

const drawerWidth = 240;

const MainWraper = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'row',
};

export default function MainLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  return (
    <AuthGuard>
      <Box sx={MainWraper}>
            {/* Mobile drawer */}
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerClose}
              onTransitionEnd={handleDrawerTransitionEnd}
              ModalProps={{ keepMounted: true }}
              sx={{
                display: { xs: 'block', sm: 'none' },
                width: drawerWidth,
                height:'100vh',
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
              }}
            >
              <Sidebar onItemClick={handleDrawerToggle} />
            </Drawer>

            {/* Desktop drawer */}
            <Drawer
              variant="permanent"
              open
              sx={{
                display: { xs: 'none', sm: 'block' },
                width: drawerWidth,
                height:'100vh',
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
              }}
            >
              <Sidebar />
            </Drawer>
            <Box  sx={{ display: 'flex', flexDirection: 'column', flex: 1,width: { sm: `calc(100% + ${drawerWidth}px)` }, }}>
            <Header onDrawerToggle={handleDrawerToggle} />
             <Box
            component="main"
            sx={{
              p: 1,
              
            }}
          >

            {children}
          </Box>
            </Box>
          </Box>

          {/* Main content */}
         
    </AuthGuard>
  );
}
