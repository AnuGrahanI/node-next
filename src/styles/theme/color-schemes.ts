import type { ColorSystemOptions } from '@mui/material/styles';
import type { ColorScheme } from './types';

export const colorSchemes = {
  dark: {
    palette: {
      primary: {
        main: '#d81b60', // Dark Pink
        light: '#f8bbd0', // Light Pink
        dark: '#880e4f',  // Deep Pink
      },
      secondary: {
        main: '#ff80ab', // Soft Pink
        light: '#ffc1e3', // Very Light Pink
        dark: '#c60055',  // Darker Pink
      },
      success: {
        main: '#4caf50', // Green (kept for contrast)
        light: '#e8f5e9',
        dark: '#2e7d32',
        contrastText: '#ffffff',
      },
      info: {
        main: '#9c27b0', // Purple (complements pink)
        light: '#e1bee7',
        dark: '#6a1b9a',
        contrastText: '#ffffff',
      },
      error: {
        main: '#f44336', // Red (kept for alerts)
        light: '#ffebee',
        dark: '#d32f2f',
        contrastText: '#ffffff',
      },
      warning: {
        main: '#ff9800', // Amber (kept for warnings)
        light: '#fff3e0',
        dark: '#e65100',
        contrastText: '#ffffff',
      },
      grey: {
        100: '#f5f5f5',
        200: '#eeeeee',
        300: '#e0e0e0',
        400: '#bdbdbd',
        500: '#9e9e9e',
        600: '#757575',
      },
      text: {
        primary: '#212121',
        secondary: '#757575',
        disabled: '#bdbdbd',
      },
      action: {
        disabledBackground: 'rgba(0, 0, 0, 0.12)',
        hoverOpacity: 0.04,
        hover: 'rgba(0, 0, 0, 0.04)',
      },
      divider: '#e0e0e0',
      background: {
        default: '#fff5f7', // Very Light Pinkish White
        paper: '#ffffff',
      },
      TableCell: {
        border: '#ffcdd2', // Light Pink Border
      },
      Alert: {
        errorStandardBg: "#ffebee",
        infoStandardBg: "#f3e5f5", // Light Purple-Pink
        successStandardBg: "#e8f5e9",
        warningStandardBg: "#fff3e0",
      },
      Avatar: {
        defaultBg: '#f8bbd0', // Light Pink
      }
    },
  },
  light: {
    palette: {
      primary: {
        main: '#d81b60', // Dark Pink
        light: '#f8bbd0', // Light Pink
        dark: '#880e4f',  // Deep Pink
      },
      secondary: {
        main: '#ff80ab', // Soft Pink
        light: '#ffc1e3', // Very Light Pink
        dark: '#c60055',  // Darker Pink
      },
      success: {
        main: '#4caf50', // Green (kept for contrast)
        light: '#e8f5e9',
        dark: '#2e7d32',
        contrastText: '#ffffff',
      },
      info: {
        main: '#9c27b0', // Purple (complements pink)
        light: '#e1bee7',
        dark: '#6a1b9a',
        contrastText: '#ffffff',
      },
      error: {
        main: '#f44336', // Red (kept for alerts)
        light: '#ffebee',
        dark: '#d32f2f',
        contrastText: '#ffffff',
      },
      warning: {
        main: '#ff9800', // Amber (kept for warnings)
        light: '#fff3e0',
        dark: '#e65100',
        contrastText: '#ffffff',
      },
      grey: {
        100: '#f5f5f5',
        200: '#eeeeee',
        300: '#e0e0e0',
        400: '#bdbdbd',
        500: '#9e9e9e',
        600: '#757575',
      },
      text: {
        primary: '#212121',
        secondary: '#757575',
        disabled: '#bdbdbd',
      },
      action: {
        disabledBackground: 'rgba(0, 0, 0, 0.12)',
        hoverOpacity: 0.04,
        hover: 'rgba(0, 0, 0, 0.04)',
      },
      divider: '#ffcdd2', // Light Pink Divider
      background: {
        default: '#fff5f7', // Very Light Pinkish White
        paper: '#ffffff',
      },
      TableCell: {
        border: '#ffcdd2', // Light Pink Border
      },
      Alert: {
        errorStandardBg: "#ffebee",
        infoStandardBg: "#f3e5f5", // Light Purple-Pink
        successStandardBg: "#e8f5e9",
        warningStandardBg: "#fff3e0",
      },
      Avatar: {
        defaultBg: '#f8bbd0', // Light Pink
      }
    },
  },
} satisfies Partial<Record<ColorScheme, ColorSystemOptions>>;