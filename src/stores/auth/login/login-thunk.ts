

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
  // throw new Error(res?.error ?? "Invalid credentials");
   return rejectWithValue("Invalid credentials"); // ✅ get error thrown in authorize()

}else{
  window.location.reload();
}

    const session = await getSession();
    if (!session) throw new Error("Session not found after sign-in");

    return session; // this becomes action.payload in your slice
  } catch (err: any) {
    return rejectWithValue(err.message ?? "Something went wrong");
  }
});
