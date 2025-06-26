import type { Components } from '@mui/material/styles';
import type { Theme } from '../types';

export const MuiTooltip = {
  styleOverrides: {
    tooltip: ({ theme }: { theme: Theme }) => ({
      backgroundColor: theme.palette.grey[900], // or use `theme.palette.background.paper` for light
      color: theme.palette.common.white,
      fontSize: theme.typography.pxToRem(12.5),
      fontWeight: 400,
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(1, 1.5),
      boxShadow: theme.shadows[3],
      maxWidth: 300,
      lineHeight: 1.5,
    }),
    arrow: ({ theme }: { theme: Theme }) => ({
      color: theme.palette.grey[900], 
    }),
  },
  defaultProps: {
    arrow: true,
    placement: 'top',
  },
} satisfies Components<Theme>['MuiTooltip'];
