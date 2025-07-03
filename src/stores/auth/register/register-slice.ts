import { createSlice } from "@reduxjs/toolkit";
import { registerUser, sendOtp, verifyOtp } from "./register-thunk";
interface RegisterState {
  loading: boolean;
  error: string | null;
  success: boolean;
  emailsent: boolean;
  verified: boolean
}
const initialState: RegisterState = {
  loading: false,
  error: null,
  success: false,
  emailsent: false,  
  verified: false
};

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    resetRegisterState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(sendOtp.pending, (state, action: any) => {
        console.log(action);
        
        state.emailsent = false;
        state.emailsent = action.payload?.success
      })
      .addCase(sendOtp.fulfilled, (state, action: any) => {
        state.emailsent = action.payload?.success ?? true;
      })
      .addCase(sendOtp.rejected, (state, action: any) => {

        state.emailsent = false;
        state.emailsent = action.payload.success
      })
      .addCase(verifyOtp.pending, (state) => {
        state.verified = false;
      })
      .addCase(verifyOtp.fulfilled, (state, action: any) => {
        state.verified = action.payload?.success ?? true; // fallback to true if undefined
        state.loading = false;
      })
      .addCase(verifyOtp.rejected, (state) => {
        state.verified = false;
      });


  },
});

export const { resetRegisterState } = registerSlice.actions;
export default registerSlice.reducer;
