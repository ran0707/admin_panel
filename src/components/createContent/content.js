import React, {useState} from 'react';
import {  Box, Typography, AppBar, Toolbar, TextField, Button, Container} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateContent = () => {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [emailError, setEmailError] = useState('');
 const [passwordError, setPasswordError] = useState('');

 const navigate = useNavigate();


 const handleLogin = async (e) =>{
  e.preventDefault();


  let valid = true;
  if(!email){
    setEmailError('Email is required');
    valid = false;
  }else{
    setEmailError('');
  }
  if(!password){
    setPasswordError('Password is required');
    valid = false;
  }else{
    setPasswordError('');
  }

  if(valid){
    try{
      const res = await axios.post('http://localhost:5000/api/create-content/sudo-login', {email, password});
      if(res.data.token){
        localStorage.setItem('token', res.data.token);
        navigate('/home-page-main');
        console.log('login success');
      }else{
        console.error('no token recived');
      }
    }catch(e){
      console.log('Error loggin in', e);
    }
  }
 };


  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
            CreateContent
          </Typography>
         <Button color='inherit' LinkComponent={Link} to='/dashboard'>Dashboard</Button>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth='sm' sx={{display:'flex', justifyContent:'center'}}>
      <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: '150px' , }}>
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
        </Container>
    </div>
  );
};

export default CreateContent;
