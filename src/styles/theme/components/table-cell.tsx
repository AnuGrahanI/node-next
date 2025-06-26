import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

export const MuiTableCell: Components<Theme>['MuiTableCell'] = {
  styleOverrides: {
    root: ({ theme }: { theme: Theme }) => ({
      borderBottom: 'var(--TableCell-borderWidth, 1px) solid',
      borderColor: theme.palette.grey[100],
    }),
    paddingCheckbox: { padding: '0 0 0 24px' },
  },
};
