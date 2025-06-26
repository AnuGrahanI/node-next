 import type { Components } from '@mui/material/styles';
 
 import type { Theme } from '../types';
 
 export const MuiSnackbar = {
   styleOverrides: {
     root: ({ theme }: { theme: Theme }) => ({
        padding: "6px 8px",
        "& .MuiAlert":{
            "& .MuiIconButton-root": {
            color:theme.palette.text.primary
          }
        },
        "& .MuiPaper-root":{
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)'
            
        },
        "& .MuiAlert-colorError": {
            alignItems: "center !important",
            "& .MuiAlert-icon":{
                padding:'7px !important',
                backgroundColor:theme.palette.error.light,
                borderRadius:'7px',
                "& path":{
                    fill: theme.palette.error.main
                }
            },
            "& .MuiAlert-message":{
                color:theme.palette.error.main
            },
            "& .MuiAlert-action":{
                padding:'0px 4px 0px 16px !important',
                color:'black'
            }
        },
        "& .MuiAlert-colorSuccess": {
            alignItems: "center !important",
            "& .MuiAlert-icon":{
                padding:'7px !important',
                backgroundColor:theme.palette.success.light,
                borderRadius:'7px',
                "& path":{
                    fill: theme.palette.success.main
                }
            },
            "& .MuiAlert-message":{
                color:theme.palette.success.main
            },
            "& .MuiAlert-action":{
                padding:'0px 4px 0px 16px !important',
                color:'black'
            }
        },
        "& .MuiAlert-colorInfo": {
            alignItems: "center !important",
            "& .MuiAlert-icon":{
                padding:'7px !important',
                backgroundColor:theme.palette.info.light,
                borderRadius:'7px',
                "& path":{
                    fill: theme.palette.info.main
                }
            },
            "& .MuiAlert-message":{
                color:theme.palette.info.main
            },
            "& .MuiAlert-action":{
                padding:'0px 4px 0px 16px !important',
                color:'black'
            }
        },
        "& .MuiAlert-colorWarning": {
            alignItems: "center !important",
            "& .MuiAlert-icon":{
                padding:'7px !important',
                backgroundColor:theme.palette.warning.light,
                borderRadius:'7px',
                "& path":{
                    fill: theme.palette.warning.main
                }
            },
            "& .MuiAlert-message":{
                color:theme.palette.warning.main
            },
            "& .MuiAlert-action":{
                padding:'0px 4px 0px 16px !important',
                color:'black'
            }
        },
        
     }),
   }
 
 } satisfies Components<Theme>['MuiSnackbar'];
 
 