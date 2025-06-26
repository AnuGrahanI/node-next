import type { Components } from '@mui/material/styles';
import type { Theme } from '../types';

export const MuiSwitch = {
    styleOverrides: {
        root: {
            width: 28,
            height: 16,
            padding: 0,
            display: 'flex',
            '&:active': {
                '& .MuiSwitch-thumb': {
                    width: 15,
                },
                '& .MuiSwitch-switchBase.Mui-checked': {
                    transform: 'translateX(9px)',
                },
            },
        },
        switchBase: ({ theme }: { theme: Theme }) => ({
            padding: 2,
            '&.Mui-checked': {
                transform: 'translateX(12px)',
                color: '#fff',
                '& + .MuiSwitch-track': {
                    opacity: 1,
                    backgroundColor: theme.palette.success.main, // Fixed typo: `sucess` -> `success`
                },
            },
        }),
        thumb: {
            boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
            width: 12,
            height: 12,
            borderRadius: 6,
            // transition: (theme: Theme) =>
            //     theme.transitions.create(['width'], {
            //         duration: 200,
            //     }),
        },
        track: {
            borderRadius: 16 / 2,
            opacity: 1,
            backgroundColor: 'rgba(0,0,0,.25)',
            boxSizing: 'border-box',
        },
    },
} satisfies Components<Theme>['MuiSwitch'];
