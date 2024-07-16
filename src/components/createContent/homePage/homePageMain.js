import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Menu, IconButton, MenuItem, Button, Box } from "@mui/material";

import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, Link } from "react-router-dom";


const HomePageMain = () => {

    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNavigation = (path) => {
        navigate(path);
        handleMenuClose();
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/sudo-login');
    };

    return (
        <div>
            <AppBar position="fixed">
                <Toolbar>
                    <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
                        Homepage content
                    </Typography>
                    <Button color='inherit' LinkComponent={Link} to='/recentreport-page'>RecentReport</Button>
                    <Button color='inherit' LinkComponent={Link} to='/seasonpest-page'>SeasonPest</Button>
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>

                    <Box sx={{ m: 2 }}></Box>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={handleMenuOpen}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={() => handleNavigation('/cultivation-main')}>CultivationPage</MenuItem>
                        <MenuItem onClick={() => handleNavigation('/community-main')}>CommunityPage</MenuItem>
                        <MenuItem onClick={() => handleNavigation('/vendors-main')}>vendors</MenuItem>

                    </Menu>
                </Toolbar>
            </AppBar>
            

            {/* body content */}
        </div>
    );
}

export default HomePageMain;