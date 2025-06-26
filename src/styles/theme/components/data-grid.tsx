import type { Components } from '@mui/material/styles';
import type { Theme } from '../types';

export const MuiDataGrid = {
  styleOverrides: {
    columnHeaderTitle: ({ theme }: { theme: Theme }) => ({
      fontSize: '14px !important',
      display: 'flex',
      alignItems: 'center',
      color: '#343A40',
      border:`0px solid ${theme.palette.grey[100]}`,
    // color: theme.palette.text.secondary,
      fontWeight: 600,
    }),
  },
} satisfies Components<Theme>['MuiDataGrid'];
