import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    let valid = true;
    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else {
      setEmailError('');
    }
    if (!password) {
      setPasswordError('password is required');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (valid) {
      try {
        const res = await axios.post('http://localhost:5000/api/login', { email, password });
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
          navigate('/dashboard');
        } else {
          console.error('no token recevied');
        }
      } catch (e) {
        console.log('Error logging in', e);
      }
    }
  };
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  return (
    <Container component="main" maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center' }}>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h2">
          welcome Admin
        </Typography>
        {/* <Typography component="h1" variant="h5">
          Sign in
        </Typography> */}
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
            InputProps={{ endAdornment:(
            <InputAdornment position="end">
              <IconButton 
              aria-label="toggle password visibility" 
              onClick={handleClickShowPassword}
              edge="end"> 
              {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
              </InputAdornment>
              ),
             }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );


}


export default Login;