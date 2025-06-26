import type { Components } from '@mui/material/styles';
import type { Theme } from '../types';

import { MuiCssBaseline } from './base-line';
import { MuiTextField } from './text-field';
import { MuiSelect } from './select-item';
import { MuiButtonBase } from './button-base';
import { MuiButton } from './button';
import { MuiIconButton } from './icon-button';
import { MuiOutlinedInput } from './outlined-input';
import { MuiTab } from './tab';
import { MuiTabs } from './tabs';
import { MuiSwitch } from './switch';
import { MuiList } from './list';
import { MuiMenu } from './menu';
import { MuiMenuItem } from './menu-item';
import { MuiLink } from './link';
import { MuiStack } from './stack';
import { MuiAutocomplete } from './auto-complete';
import { MuiSnackbar } from "./snack-bar"
import { MuiAlert } from "./alert"
import { MuiTableBody } from './table-body';
import { MuiTableCell } from './table-cell';
import { MuiTableHead } from './table-head';
import { MuiBreadcrumbs } from './bread-crumb';
import {MuiTooltip} from "./tool-tip";
import {MuiDrawer} from "./drawer";
// import {MuiSlider} from "./slide";
import {MuiDialog} from "./dialog";


export const components = {
  MuiCssBaseline,
  MuiTextField,
  MuiSelect,
  MuiButtonBase,
  MuiSwitch,
  // MuiAvatar,
  MuiButton,
  MuiIconButton,
  MuiOutlinedInput,
  MuiTab,
  MuiTabs,
  MuiList,
  MuiMenu,
  MuiMenuItem,
  MuiLink,
  MuiStack,
  MuiAutocomplete,
  MuiSnackbar,
  MuiTableBody,
  MuiTableCell,
  MuiTableHead,
  MuiAlert,
  MuiTooltip,
  MuiBreadcrumbs,

  MuiDrawer,
  // MuiSlider
  MuiDialog
} satisfies Components<Theme>;
