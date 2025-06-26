import type { Components } from '@mui/material/styles';
import type { Theme } from '../types';

export const MuiDrawer = {
  styleOverrides: {
    paperAnchorRight: {
      animation: 'bounceInDrawer 0.6s ease-out',
      '@keyframes bounceInDrawer': {
        '0%': { transform: 'translateX(100%)' },
        '60%': { transform: 'translateX(-20px)' },
        '80%': { transform: 'translateX(10px)' },
        '100%': { transform: 'translateX(0)' },
      },
    },
     paperAnchorLeft: {
      animation: 'bounceInDrawerLeft 0.6s ease-out',
      '@keyframes bounceInDrawerLeft': {
        '0%': { transform: 'translateX(-100%)' },
        '60%': { transform: 'translateX(20px)' },
        '80%': { transform: 'translateX(-10px)' },
        '100%': { transform: 'translateX(0)' },
      },
    },
  },
} satisfies Components<Theme>['MuiDrawer'];
