// import { createAsyncThunk } from "@reduxjs/toolkit";
// import api from '@/lib/apiClient';

// interface LoginPayload {
//   email: string;
//   password: string;
// }

// export const loginUser = createAsyncThunk(
//   'auth/register',
//   async (payload: LoginPayload, { rejectWithValue }) => {
//     try {
//       const response = await api.post("/api/auth/login", payload);
//             const { user, accessToken, refreshToken }:any = response.data;

//       sessionStorage.setItem("user", JSON.stringify(user));
//       sessionStorage.setItem("accessToken", accessToken);
//       sessionStorage.setItem("refreshToken", refreshToken);      
//       return response.message;
//     } catch (err: any) {
//       console.log(err);
      
//       return rejectWithValue(err.message || 'Something went wrong');
//     }
//   }
// );

// stores/auth/login/login-thunk.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import { signIn, getSession } from "next-auth/react";

interface LoginPayload {
  email: string;
  password: string;
}


export const loginUser = createAsyncThunk<
  Awaited<ReturnType<typeof getSession>>,
  LoginPayload,
  { rejectValue: string }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
   const res = await signIn("credentials", {
  redirect: false,
  email: payload.email,
  password: payload.password,
});

if (!res || res.error) {
  console.error("Login failed:", res?.error); // Should not log after this fix
  throw new Error(res?.error ?? "Invalid credentials");
}


    // NextAuth has now set the cookies; pull the session so we can
    // return user info to the slice (optional but convenient).
    const session = await getSession();
    if (!session) throw new Error("Session not found after sign-in");

    return session; // this becomes action.payload in your slice
  } catch (err: any) {
    return rejectWithValue(err.message ?? "Something went wrong");
  }
});
