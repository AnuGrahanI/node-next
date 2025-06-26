"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/component/core/theme-provider/theme-provider";
import StoreProvider from "./store-provider";
import GlobalSnackbar from "@/component/core/global-snackbar";
import { AuthProvider } from "@/context/auth/auth-context";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <StoreProvider>
          <ThemeProvider>
            {children}
            <GlobalSnackbar />
          </ThemeProvider>
        </StoreProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
