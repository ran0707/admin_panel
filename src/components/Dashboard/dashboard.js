// src/components/Dashboard/Dashboard.js
import React from 'react';
import Header from '../header/header';
import Maintable from '../Table/maintable';
import { Box } from '@mui/material';

const Dashboard = () => {
  return (
    <div>
      <Header/>
     <div >
      <Box sx={{mx:5}}>
      <h1>Welcome to the Admin Dashboard</h1>
      </Box>
     <Maintable/>
     </div>
    </div>
  );
};

export default Dashboard;
