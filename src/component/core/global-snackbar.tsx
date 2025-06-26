"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, keyframes, Slide, SlideProps, Snackbar } from "@mui/material";
import { RootState } from "@/stores/store";
import { hideSnackbar } from "@/stores/snackbar/snackbar-slice";
 
const GlobalSnackbar = () => {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector((state: RootState) => state.snackbar);
 
  const handleClose = () => {
    dispatch(hideSnackbar());
  };
    const bounceAnimation = keyframes`
      0% { transform: translateY(-50px); opacity: 0; }
      50% { transform: translateY(0); opacity: 1; }
      75% { transform: translateY(-10px); }
      100% { transform: translateY(0); }
    `;
    function SlideTransition(props: SlideProps) {
      return <Slide {...props} direction="down" />;
    }
  return (
    <Snackbar
      TransitionComponent={SlideTransition}
      sx={{
        "& .MuiPaper-root": {
          animation: `${bounceAnimation} 0.6s ease-in-out`,
        },}}
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={handleClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
};
 
export default GlobalSnackbar;
 