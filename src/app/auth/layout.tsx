// app/auth/layout.tsx

"use client";
import { ReactNode } from "react";
import { Container, Box, Paper } from "@mui/material";
import { GuestGuard } from "@/component/auth/guards/guest-guard";



export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
          <GuestGuard>
          <Container maxWidth="sm">
            <Box
              display="flex"
              minHeight="100vh"
              justifyContent="center"
              alignItems="center"
            >
              <Paper elevation={1} sx={{ p: 4, width: '360px', borderRadius: 3 }}>
                {children}
              </Paper>
            </Box>
          </Container>
          </GuestGuard>
  );
}
