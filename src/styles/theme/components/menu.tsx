import type { Components } from '@mui/material/styles';
import type { Theme } from '../types';

export const MuiMenu = {
  styleOverrides: {
    root: {
      marginTop: '4px',
    },
    paper: ({ theme }: { theme: Theme }) => ({
      '& .Mui-focusVisible': {
        backgroundColor: `${theme.palette.grey[300]} !important`,
      },
      scrollbarWidth: 'thin',
      scrollbarColor: `${theme.palette.grey[300]} transparent`, 
      '&::-webkit-scrollbar': {
        width: '8px',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: theme.palette.grey[300], 
        borderRadius: '4px',
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: 'transparent',
      },
    }),
  },
} satisfies Components<Theme>['MuiMenu'];
