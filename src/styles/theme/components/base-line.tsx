
import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

export const MuiCssBaseline = {
  styleOverrides: {
    '*': {
          boxSizing: 'border-box',
          scrollbarWidth: 'none',        
      msOverflowStyle: 'none'
        },
        html: {
          height: '100%',
          width: '100%',
        },
        a: {
          textDecoration: 'none !important',
        },
        body: {
          height: '100%',
          margin: 0,
          padding: 0,
        },
        '#root': {
          height: '100%',
        },
        '::-webkit-scrollbar': {
            display: 'none',
        },
}
} satisfies Components<Theme>['MuiCssBaseline'];

