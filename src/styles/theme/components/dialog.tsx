import type { Components } from '@mui/material/styles';
import type { Theme } from '../types';

export const MuiDialog: Components<Theme>['MuiDialog'] = {
  styleOverrides: {
    paper: {
      animation: 'bounceInDialog 0.6s ease-out',
      '@keyframes bounceInDialog': {
        "0%": { transform: "translateY(100%)" },
         "60%": { transform: "translateY(-25px)" },
         "80%": { transform: "translateY(10px)" },
         "100%": { transform: "translateY(0)" },
      },
    },
  },
};

// in future version if you need bouncing effect for every direction

//add every dialog tag slideDirection="up" => "up | down| left| right"

// export const MuiDialog: Components<Theme>['MuiDialog'] = {
//   styleOverrides: {
//     paper: ({ ownerState }) => ({
//       ...(ownerState.slideDirection === 'up' && {
//         animation: 'bounceInUp 0.6s ease-out'
//       }),
//       ...(ownerState.slideDirection === 'down' && {
//         animation: 'bounceInDown 0.6s ease-out'
//       }),
//       ...(ownerState.slideDirection === 'left' && {
//         animation: 'bounceInLeft 0.6s ease-out'
//       }),
//       ...(ownerState.slideDirection === 'right' && {
//         animation: 'bounceInRight 0.6s ease-out'
//       }),
//     }),
//   },
// };
