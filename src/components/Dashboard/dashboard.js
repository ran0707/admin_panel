// src/components/Dashboard/Dashboard.js
import React from 'react';
import Header from '../header/header';
import Maintable from '../Table/maintable';

const Dashboard = () => {
  return (
    <div>
      <Header/>
     <div>
     <h1>Welcome to the Admin Dashboard</h1>
     <Maintable/>
     </div>
    </div>
  );
};

export default Dashboard;
