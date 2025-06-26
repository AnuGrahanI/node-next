

  import type { Components } from '@mui/material/styles';
  
  import type { Theme } from '../types';
  
  export const MuiMenuItem = {
    styleOverrides: {
        root: {
                minHeight:'38px'
            }
              
    },
  } satisfies Components<Theme>['MuiMenuItem'];
  
  