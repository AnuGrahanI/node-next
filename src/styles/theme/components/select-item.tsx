import type { Components } from '@mui/material/styles';
import type { Theme } from '../types';
import { SvgIcon, SvgIconProps } from '@mui/material';
    

    const CustomIcon: React.FC<SvgIconProps> = (props) => (
        <SvgIcon {...props}>
          <svg width="20" height="22" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.9201 9.51953L13.4001 16.0395C12.6301 16.8095 11.3701 16.8095 10.6001 16.0395L4.08008 9.51953" stroke="#343A40" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </SvgIcon>
      );
    export const MuiSelect = {
      styleOverrides: {
          root: {

        },      
      },
      defaultProps : {
        IconComponent: CustomIcon
        },
    } satisfies Components<Theme>['MuiSelect'];
    
    