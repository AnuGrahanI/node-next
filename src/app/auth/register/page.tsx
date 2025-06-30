'use client';

import { resetRegisterState } from '@/stores/auth/register/register-slice';
import { registerUser } from '@/stores/auth/register/register-thunk';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Stack,
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
    <Box mx="auto" >
      <Box sx={{ textAlign:'center',mb:1}}>
        <Typography variant="h4"  color="primary">
          PEA`ZA
        </Typography>
      </Box>
      <Typography variant="h5" mb={2}>
        Register
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box>
          <Typography variant="subtitle2" >Name</Typography>
          <TextField
            name="name"
            fullWidth
            margin="normal"
            value={form.name}
            onChange={handleChange}
          />
        </Box>
        <Box>
          <Typography variant="subtitle2" >Email</Typography>
          <TextField
            name="email"
            fullWidth
            margin="normal"
            value={form.email}
            onChange={handleChange}
          />
        </Box>
        <Box>
          <Typography variant="subtitle2" >Password</Typography>
          <TextField
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={form.password}
            onChange={handleChange}
          />
        </Box>
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color='primary'
          sx={{ my: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
        </Button>
                  <Divider>or </Divider>

        <Stack direction="row" justifyContent="center" mt={2}>
            <Typography variant="body2">
              Already have an account? {' '}
              <Button 
                variant="text" 
                size="small" 
                onClick={() => router.push("/auth/login")}
                sx={{ textTransform: 'none', minWidth: 'auto' }}
              >
                Login
              </Button>
            </Typography>
          </Stack>
      </form>
    </Box>
  );
}
