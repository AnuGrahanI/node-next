
import type { Components } from '@mui/material/styles';
import type { Theme } from '../types';

export const MuiIconButton = {
  styleOverrides: {
    root:{
    },
    colorError: () => ({
      '&:hover': {
        backgroundColor: `#ff939357 !important`,
      },
    }),
    colorSuccess: () => ({
        '&:hover': {
          backgroundColor: `#0bb35938 !important`,
    },})
  },
} satisfies Components<Theme>['MuiIconButton'];