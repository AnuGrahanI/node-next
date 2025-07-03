"use client";

import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Divider,
  Stack,
  Collapse,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/stores/hooks";
import { loginUser } from "@/stores/auth/login/login-thunk";
import { SignInButtonWithProvider } from "@/component/auth/provider/signin-with-provoder-button";
import { setEmail } from "@/stores/auth/forgot-password/forgot-password-slice";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  useEffect(() => {
    // Show forgot password only when email has content and password field is being interacted with
    setShowForgotPassword(form.email.length > 0 && form.password.length > 0);
  }, [form.email, form.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await dispatch(loginUser(form));
    setLoading(false);

    if (loginUser.fulfilled.match(result)) {
      router.refresh();
    }
  };

  return (
    <>
      <Box sx={{ textAlign:'center',mb:1}}>
              <Typography variant="h4"  color="primary">
                PE`ZU
              </Typography>
            </Box>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Login
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={1}>
          <Box>
          <Typography variant="subtitle2" >Email</Typography>
          <TextField
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            fullWidth
          />
          </Box>
          <Box> 
            <Typography variant="subtitle2" >Password</Typography>
          <TextField
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            fullWidth
          />
          </Box>

          
          {/* Forgot Password Link - Only shows when conditions are met */}
          <Collapse in={showForgotPassword}>
            <Box display="flex" justifyContent="flex-end">
              <Button 
                variant="text" 
                size="small"
                onClick={() => {
                  dispatch(setEmail(form.email));
                  router.push(`/auth/forgot-password`);
                }}
                sx={{ textTransform: 'none', mb: 1 }}
              >
                Forgot Password?
              </Button>
            </Box>
          </Collapse>

          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>
          
          <Divider/>
          
          {/* <SignInButtonWithProvider provider="microsoft" /> */}
          <SignInButtonWithProvider provider="google" />

          <Divider>or </Divider>
          <Stack direction="row" justifyContent="center" mt={2}>
            <Typography variant="body2">
              Don’t have an account?{" "}
              <Button 
                variant="text" 
                size="small" 
                onClick={() => router.push("/auth/register")}
                sx={{ textTransform: 'none', minWidth: 'auto' }}
              >
                Create one
              </Button>
            </Typography>
          </Stack>
        </Box>
      </form>
    </>
  );
}