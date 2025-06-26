'use client';

import { resetRegisterState } from '@/stores/auth/register/register-slice';
import { registerUser } from '@/stores/auth/register/register-thunk';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useEffect } from 'react';


export default function RegisterForm() {
  const dispatch = useAppDispatch();
    const router = useRouter();
  
  const { loading} = useAppSelector((state) => state.register);

  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(registerUser(form));
  };

  useEffect(() => {
    return () => {
      dispatch(resetRegisterState());
    };
  }, [dispatch]);

  return (
    <Box mx="auto" mt={5}>
      <Typography variant="h5" mb={2}>
        Register
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          fullWidth
          margin="normal"
          value={form.name}
          onChange={handleChange}
        />
        <TextField
          label="Email"
          name="email"
          fullWidth
          margin="normal"
          value={form.email}
          onChange={handleChange}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          value={form.password}
          onChange={handleChange}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color='primary'
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
        </Button>
        <Button sx={{ mt: 2 }} fullWidth variant="outlined" onClick={() => router.push("/auth/login")}>
            Login
          </Button>
      </form>
    </Box>
  );
}
