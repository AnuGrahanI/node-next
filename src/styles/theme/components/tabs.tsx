 import type { Components } from '@mui/material/styles';
 
 import type { Theme } from '../types';
 
 export const MuiTabs = {
   styleOverrides: {
     root: ({ theme }: { theme: Theme }) => ({
        height:'38px !important',
        minHeight:'38px !important',
        MuiButtonBase:{
          padding:'17px !important',
          height:'34px !important',
          minHeight:'34px !important',
          '&:hover':{
          '& .MuiSvgIcon-root': {
        fill: theme.palette.primary.main,
        },
      },
        },
        '& .MuiSvgIcon-root': {
        fill: theme.palette.grey[200], // Change icon color dynamically

      },
      "& .MuiTabScrollButton-root":{
        marginRight:"0px !important",
        padding:'7px 0  !important',
      },
              "& .MuiButtonBase-root":{
          padding:'7px ',
        height:'34px !important',
        minHeight:'34px !important',
        marginRight:"10px",
        }
     }),
     indicator: ({ theme }: { theme: Theme }) => ({
        display:'flex',
        justifyContent: 'center',
        // backgroundColor: "transparent",
        height: '3px',
          "& span":{
            // backgroundColor:theme.palette.primary.main,
            height: '3px !important',
            width:'30% !important',
            display:'inline-block',
            borderRadius:'10px'
          }
     })
   }
 
 } satisfies Components<Theme>['MuiTabs'];
 
 