import type { Components } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';

import type { Theme } from '../types';

export const MuiTableHead = {
  styleOverrides: {
    root: ({ theme }: { theme: Theme }) => ({
      [`& .${tableCellClasses.root}`]: {
        backgroundColor: theme.palette.grey[100],
        color: 'var(--mui-palette-text-primary)',
        lineHeight: 1,
      },
    })
  },
} satisfies Components<Theme>['MuiTableHead'];