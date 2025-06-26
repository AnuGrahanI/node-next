import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

export const MuiTab = {
  styleOverrides: {
    root: ({ theme }: { theme: Theme }) => ({
      borderRadius:'7px',
      '&:hover':{
        backgroundColor:'rgba(239, 238, 255, .5)',
        color:theme.palette.primary.main
      },
    }),
    selected: ({ theme }: { theme: Theme }) => ({
      backgroundColor:'none',
      color:theme.palette.text.primary
    })
  }

} satisfies Components<Theme>['MuiTab'];
