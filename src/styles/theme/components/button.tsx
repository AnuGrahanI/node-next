import type { Components } from '@mui/material/styles';
import type { Theme } from '../types';

export const MuiButton = {
  styleOverrides: {
    root: ({ theme }) => ({
      textTransform: 'none',
      boxShadow: 'none !important',
      [theme.breakpoints.up('xl')]: {
        padding: '12px 12px',
      },
      [theme.breakpoints.down('sm')]: {
        padding: '6px 6px !important',
      },
      // padding: '6px 12px !important',
    }),
    text:{
      padding: '4px 16px',
    },
    textPrimary: ({ theme }: { theme: Theme }) => ({
      '&:hover': {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.main,
      },
    }),
    textSecondary: ({ theme }: { theme: Theme }) => ({
      '&:hover': {
        backgroundColor: theme.palette.secondary.main,
        color: 'white',
      },
    }),
    textSuccess: ({ theme }: { theme: Theme }) => ({
      '&:hover': {
        backgroundColor: theme.palette.success.main,
        color: 'white',
      },
    }),
    textError: ({ theme }: { theme: Theme }) => ({
      '&:hover': {
        backgroundColor: theme.palette.error.main,
        color: 'white',
      },
    }),
    textInfo: ({ theme }: { theme: Theme }) => ({
      '&:hover': {
        backgroundColor: theme.palette.info.main,
        color: 'white',
      },
    }),
    textWarning: ({ theme }: { theme: Theme }) => ({
      '&:hover': {
        backgroundColor: theme.palette.warning.main,
        color: 'white',
      },
    }),
    outlinedPrimary: ({ theme }: { theme: Theme }) => ({
      backgroundColor: theme.palette.primary.light,
     '&:hover': {
        backgroundColor: theme.palette.primary.main,
            color: 'white',
        }
    }),
    outlinedSecondary: ({ theme }: { theme: Theme }) => ({
      // backgroundColor: theme.palette.secondary.light,
      '&:hover': {
        backgroundColor: theme.palette.secondary.main,
            color: 'white',
        }
    }),
    outlinedSuccess: ({ theme }: { theme: Theme }) => ({
      // backgroundColor: theme.palette.success.light,
      '&:hover': {
      backgroundColor: theme.palette.success.light,
      color:theme.palette.success.main
      }
    }),
    outlinedError: ({ theme }: { theme: Theme }) => ({
      // backgroundColor: theme.palette.error.light,
      '&:hover': {
      backgroundColor: theme.palette.error.light,
      color:theme.palette.error.main
      }
    }),
    outlinedInfo: ({ theme }: { theme: Theme }) => ({
      backgroundColor: theme.palette.info.light,
      '&:hover': {
      backgroundColor: theme.palette.info.main,
      color:'white'
      }
    }),
    outlinedWarning: ({ theme }: { theme: Theme }) => ({
      backgroundColor: theme.palette.warning.light,
      '&:hover': {
      backgroundColor: theme.palette.warning.main,
      color:'white'
      }
    }),
    containedPrimary: ({ theme }: { theme: Theme }) => ({
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
        color: 'white',
      },
    }),
    containedSecondary: ({ theme }: { theme: Theme }) => ({
      '&:hover': {
        backgroundColor: theme.palette.secondary.dark,
        color: 'white',
      },
    }),
    containedWarning: ({ theme }: { theme: Theme }) => ({
      '&:hover': {
        backgroundColor: theme.palette.warning.dark,
        color: 'white',
      },
    }),
    containedError: ({ theme }: { theme: Theme }) => ({
      '&:hover': {
        backgroundColor: theme.palette.error.dark,
        color: 'white',
      },
    }),
    containedSuccess: ({ theme }: { theme: Theme }) => ({
      '&:hover': {
        backgroundColor: theme.palette.success.dark,
        color: 'white',
      },
    }),
   containedInfo: ({ theme }: { theme: Theme }) => ({
      '&:hover': {
        backgroundColor: theme.palette.info.dark,
        color: 'white',
      },
    }),
    // sizeSmall: ({ theme }) => ({ padding: '4px 14px' }),
    // sizeMedium: ({ theme }) => ({ padding: '8px 20px' }),
    // sizeLarge: ({ theme }) => ({ padding: '11px 24px' }),
    // textSizeSmall: ({ theme }) => ({ padding: 'px 12px' }),
    // textSizeMedium: ({ theme }) => ({ padding: '9px 16px' }),
    // textSizeLarge: ({ theme }) => ({ padding: '12px 16px' }),
  
  },
} satisfies Components<Theme>['MuiButton'];