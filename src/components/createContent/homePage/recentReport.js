import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

const RecentReport = () =>{

    return(
        <div>
            <AppBar position="fixed">
                <Toolbar>
                    <Typography variant="h3" component="div" sx={{flexGrow: 1}}>
                    RecentReport
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default RecentReport;