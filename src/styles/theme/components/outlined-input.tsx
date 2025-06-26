import type { Components } from "@mui/material/styles";
import type { Theme } from "../types";

export const MuiOutlinedInput: Components<Theme>["MuiOutlinedInput"] = {
  styleOverrides: {
    root: ({ theme }: { theme: Theme }) => ({
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.grey[300],
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.grey[500],
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.main,
      },
      "&:hover.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.main,
      },
      "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.grey[300],
      },
    }),

    input: ({ theme }: { theme: Theme }) => ({
      [theme.breakpoints.up("xl")]: {
        padding: "12px 12px !important",
      },
      [theme.breakpoints.down("sm")]: {
        padding: "6px 6px !important",
      },
      padding: "6px 12px !important",

      "&:-webkit-autofill": {
        WebkitBoxShadow: "0 0 0px 1000px white inset", 
        color: "black",
        WebkitTextFillColor: "black",
        caretColor: "black",
      },
      "&:-webkit-autofill:focus": {
        color: "black",
      },
    }),

    inputSizeSmall: {
      padding: "8px 12px",
    },
  },
};
