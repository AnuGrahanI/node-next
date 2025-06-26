
import type { Components } from '@mui/material/styles';
import type { Theme } from '../types';

export const MuiBreadcrumbs = {
  styleOverrides: {
    root: ({ theme }: { theme: Theme }) => ({
      fontSize: '12px',
      marginBottom: '0 !important',
      '& .MuiBreadcrumbs-separator': {
             color: '#b389d9',
        },
        '& .MuiBreadcrumbs-li:last-of-type': {
        '& ~ .MuiBreadcrumbs-separator': {
          color: theme.palette.primary.main,
        },
      },
      '& .MuiBreadcrumbs-ol': {
        '& .MuiBreadcrumbs-li': {
          '& .MuiTypography-root': {
            color: '#b389d9', 
            fontWeight: 700,
          },
          '&:last-of-type .MuiTypography-root': {
            color: theme.palette.primary.main, 
            fontWeight: 700,
          },
        },
      },
    }),

    separator: ({ theme }: { theme: Theme }) => ({
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1)
    }),
  },
} satisfies Components<Theme>['MuiBreadcrumbs'];
