import { isFulfilled, isRejected } from "@reduxjs/toolkit";
import { showSnackbar } from "./snackbar/snackbar-slice";
const snackbarMiddleware = (storeAPI: any) => (next: any) => (action: any) => {
  if (isRejected(action)) {
    let errorMessage = action.payload as string;
    
    if (typeof action.payload !== 'string') {
      errorMessage = action.payload?.message || 
                    action.payload?.error || 
                    'An error occurred';
    }
    
    storeAPI.dispatch(showSnackbar({ 
      message: errorMessage, 
      severity: "error" 
    }));
  
  }if (isFulfilled(action)) {
    const successMessages = action?.payload;
   
    if(successMessages != undefined && typeof successMessages == "string" && successMessages.trim() !== "") {
        storeAPI.dispatch(showSnackbar({ message: action.payload || action.payload.statusMessage, severity: "success" }));
    }
  }
  return next(action);
};
 
export default snackbarMiddleware;
 
 