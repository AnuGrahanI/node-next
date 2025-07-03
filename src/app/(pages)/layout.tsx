'use client';

import { ReactNode } from "react";
import { AuthGuard } from '@/component/auth/guards/auth-guard';
import { Box, Drawer } from '@mui/material';
import Header from "@/component/layout/header/header";
import Sidebar from "@/component/layout/sidebar/sidebar";
import BottomNav from "@/component/layout/bottom-nav/bottom-nav";

const drawerWidth = 240;

const MainWraper = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'row',
};

export default function MainLayout({ children }: { children: ReactNode }) {
  

  return (
    <AuthGuard>
      <Box sx={MainWraper}>

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
              <Header  />
              <Box
                component="main"
                sx={{p: 1}}
              >
              {children}
              </Box>
              <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                <BottomNav />
              </Box>
            </Box>
          </Box>

          {/* Main content */}
         
    </AuthGuard>
  );
}
