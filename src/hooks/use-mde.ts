// Create a new file useColorMode.ts
'use client';

import { useColorScheme as useMuiColorScheme } from '@mui/material/styles';
export function useColorMode() {
  const { mode, setMode } = useMuiColorScheme();
  const toggleColorMode = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  return { mode, toggleColorMode };
}