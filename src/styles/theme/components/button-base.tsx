
  import type { Components } from '@mui/material/styles';
  
  import type { Theme } from '../types';
  
  export const MuiButtonBase = {
    styleOverrides: {
      root: { 
        textTransform: 'none',
        boxShadow: 'none !important',
       '&.Mui-disabled': {
        color: 'rgb(13 12 12 / 30%) !important',
      },
        
     },
    
        
      
    },
  } satisfies Components<Theme>['MuiButtonBase'];
  
  