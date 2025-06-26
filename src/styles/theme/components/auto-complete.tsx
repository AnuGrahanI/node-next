import type { Components } from '@mui/material/styles';
import type { Theme } from '../types';

const CustomIcon= (
 <svg width="20" height="22" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.9201 9.51953L13.4001 16.0395C12.6301 16.8095 11.3701 16.8095 10.6001 16.0395L4.08008 9.51953" stroke="#343A40" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
  );
export const MuiAutocomplete = {
  styleOverrides: { 
    root: {
       "& .MuiFormControl-root":{
        marginBottom:'0px',
        "& .MuiInputBase-root":{
          "& input": {
            padding :'6px 52px 6px 12px !important',
          }
        }
      }
    },
    inputRoot: ({ theme }: { theme: Theme }) => ({
      [theme.breakpoints.up('xl')]: {
        padding: '6px 12px',
      },
      [theme.breakpoints.down('xl')]: {
        padding: '0px 0px !important',
      },
    }),
    listbox:({ theme }) => ({
        maxHeight: '135px',
        '& .Mui-focusVisible': {
          backgroundColor: `${theme.palette.grey[300]} !important`, 
        },
      overflowY: 'auto', 
      scrollbarWidth: 'thin', 
      scrollbarColor: `${theme.palette.grey[300]} transparent`, 
      '&::-webkit-scrollbar': {
        width: '8px', 
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: theme.palette.grey[300], 
        borderRadius: '4px', 
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: 'transparent', 
      },
     }),
    popper:{
    
    }
  },
  defaultProps: {
    popupIcon: CustomIcon,
  },
} satisfies Components<Theme>['MuiAutocomplete'];