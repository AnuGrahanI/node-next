'use client';

import { useState, useEffect } from 'react';
import {
  Box, Button, CircularProgress, Divider, Stack,
  TextField, Typography, InputAdornment, IconButton
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SendIcon from '@mui/icons-material/Send';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { registerUser, sendOtp, verifyOtp } from '@/stores/auth/register/register-thunk';
import { resetRegisterState } from '@/stores/auth/register/register-slice';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Validation Schema
const RegisterSchema = Yup.object().shape({
  fname: Yup.string().required('First name is required'),
  lname: Yup.string().required('Last name is required'),
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
});

export default function RegisterForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, emailsent, verified } = useAppSelector((state) => state.register);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleSendOtp = async (email: string) => {
    try {
      await dispatch(sendOtp({ email })).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const handleVerifyOtp = async (email: string) => {
    const enteredOtp = otp.join('');
    try {
      await dispatch(verifyOtp({ email, otp: enteredOtp })).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(resetRegisterState());
    };
  }, [dispatch]);

  return (
    <Box mx="auto">
      <Box sx={{ textAlign: 'center', mb: 1 }}>
        <Typography variant="h4" color="primary">PE`ZU</Typography>
      </Box>
      <Typography variant="h5" mb={2}>Register</Typography>

      <Formik
        initialValues={{ fname: '', lname: '', email: '', username: '' }}
        validationSchema={RegisterSchema}
        onSubmit={async (values) => {
          const resultAction = await dispatch(registerUser(values));
          if (registerUser.fulfilled.match(resultAction)) {
            router.push('/auth/login');
          }
        }}
      >
        {({ values, handleChange, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
              <Box flex={1}>
                <Typography variant="subtitle2">First Name</Typography>
                <Field
                  as={TextField}
                  name="fname"
                  fullWidth
                  margin="normal"
                  onChange={handleChange}
                  value={values.fname}
                  helperText={<ErrorMessage name="fname" />}
                  // error={Boolean(<ErrorMessage name="fname" />)}
                />
              </Box>
              <Box flex={1}>
                <Typography variant="subtitle2">Last Name</Typography>
                <Field
                  as={TextField}
                  name="lname"
                  fullWidth
                  margin="normal"
                  onChange={handleChange}
                  value={values.lname}
                  helperText={<ErrorMessage name="lname" />}
                  // error={Boolean(<ErrorMessage name="lname" />)}
                />
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2">Username</Typography>
              <Field
                as={TextField}
                name="username"
                fullWidth
                margin="normal"
                onChange={handleChange}
                value={values.username}
                helperText={<ErrorMessage name="username" />}
                // error={Boolean(<ErrorMessage name="username" />)}
              />
            </Box>

            <Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="subtitle2">Email</Typography>
                {verified && <CheckCircleIcon color="success" fontSize="small" />}
              </Box>
              <Field
                as={TextField}
                name="email"
                fullWidth
                margin="normal"
                onChange={handleChange}
                value={values.email}
                helperText={<ErrorMessage name="email" />}
                // error={Boolean(<ErrorMessage name="email" />)}
                InputProps={{
                  endAdornment: !verified && (
                    <InputAdornment position="end">
                      <IconButton onClick={() => handleSendOtp(values.email)} edge="end">
                        <SendIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {emailsent && !verified && (
              <Stack direction="row" spacing={1} justifyContent="center" my={1}>
                {otp.map((digit, index) => (
                  <TextField
                    key={index}
                    id={`otp-${index}`}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    inputProps={{ maxLength: 1, style: { textAlign: 'center' } }}
                    sx={{ width: '40px' }}
                  />
                ))}
                <Button onClick={() => handleVerifyOtp(values.email)} disabled={verified}>
                  {verified ? <CircularProgress size={18} /> : 'Verify'}
                </Button>
              </Stack>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ my: 2 }}
              disabled={loading || !verified}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
            </Button>

            <Divider>or </Divider>

            <Stack direction="row" justifyContent="center" mt={2}>
              <Typography variant="body2">
                Already have an account?{' '}
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
          </Form>
        )}
      </Formik>
    </Box>
  );
}
