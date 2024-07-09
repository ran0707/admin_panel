import React from "react";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {ThemeProvider} from '@mui/material/styles';
import theme from "./theme";
import Login from './components/auth/login';
import Dashboard from './components/Dashboard/dashboard';
import ProtectedRoute from "./components/ProtectedRoute";
import UserTabel from "./components/Dashboard/UserTabel";
import CreateContent from "./components/createContent/content";


function App() {
  return (
      <ThemeProvider theme={theme}>
          <Router>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/dashboard" element={<ProtectedRoute component={Dashboard}/>}/>
        <Route path="/users" element={<UserTabel/>}/>
        <Route path="/create-content" element={<CreateContent/>}/>
        <Route exact path="/" element={<Login/>}/>
      </Routes>
    </Router>
      </ThemeProvider>
  );
}

export default App;
