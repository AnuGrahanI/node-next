
  import type { Components } from '@mui/material/styles';
  
  import type { Theme } from '../types';
  
  export const MuiTextField = {
    styleOverrides: {
        root: {
                marginTop:'4px',
                marginBottom:'10px'
            }
              
    },
  } satisfies Components<Theme>['MuiTextField'];
  
  