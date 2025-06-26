
  import type { Components } from '@mui/material/styles';
  
  import type { Theme } from '../types';
  
  export const MuiList = {
    styleOverrides: {
        root: {
               padding:'8px',
               mt:'4px'
            }
              
    },
  } satisfies Components<Theme>['MuiList'];
  
  