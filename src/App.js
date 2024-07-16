import React from "react";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {ThemeProvider} from '@mui/material/styles';
import theme from "./theme";
import Login from './components/auth/login';
import Dashboard from './components/Dashboard/dashboard';
import ProtectedRoute from "./components/ProtectedRoute";
import UserTabel from "./components/Dashboard/UserTabel";
import CreateContent from "./components/createContent/content";
import VendorsMain from "./components/createContent/vendors";
import CultivationMain from "./components/createContent/cultivationPage/cultivationMain";
import HomePageMain from "./components/createContent/homePage/homePageMain";
import RecentReport from "./components/createContent/homePage/recentReport";
import SeasonPest from "./components/createContent/homePage/seasonPest";




function App() {
  return (
      <ThemeProvider theme={theme}>
          <Router>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/dashboard" element={<ProtectedRoute component={Dashboard}/>}/>
        <Route path="/users" element={<UserTabel/>}/>
        <Route path="/create-content" element={<CreateContent/>}/>
        <Route path="/vendors-main" element={<VendorsMain/>}/>
        <Route path="/cultivation-main" element={<CultivationMain/>}/>
        <Route path="/home-page-main" element={<HomePageMain/>}/>
        <Route path="/recentreport-page" element={<RecentReport/>}/>
        <Route path="/seasonpest-page" element={<SeasonPest/>}/>
        <Route exact path="/" element={<Login/>}/>
      </Routes>
    </Router>
      </ThemeProvider>
  );
}

export default App;
