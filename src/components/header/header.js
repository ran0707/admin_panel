import React from 'react';
import { AppBar, Toolbar, Typography, Button,  } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h3" sx={{ flexGrow: 2 }}>
          Admin panel
        </Typography>
        <Button color='inherit' LinkComponent={Link} to='/create-content'>createContent</Button>
        <Button color='inherit' LinkComponent={Link} to='/users'>Database</Button>
        <Button color="inherit" onClick={handleLogout}>Logout</Button>
       
      </Toolbar>
    </AppBar>
  );
};

export default Header;
