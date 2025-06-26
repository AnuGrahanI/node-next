'use client';

import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import {  createTheme, ThemeProvider as CssVarsProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { StyledEngineProvider } from '@mui/material/styles';
import { components } from '@/styles/theme/components/components';
import { shadows } from '@/styles/theme/shadows';
import { colorSchemes } from '@/styles/theme/color-schemes';



export interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps): React.JSX.Element {
  const theme = createTheme({
    breakpoints: { values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1440 } },
    components,
    shadows,
    colorSchemes,
    shape: { borderRadius: 7 },
  });

  return (
    <AppRouterCacheProvider>
    <StyledEngineProvider injectFirst>

      <CssVarsProvider theme={theme}>
        <CssBaseline />
        {children}
      </CssVarsProvider>

    </StyledEngineProvider>
    </AppRouterCacheProvider>
   
  );
}
