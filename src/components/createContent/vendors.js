import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

const VendorsMain = () =>{

    return(
        <div>
            <AppBar position="fixed">
                <Toolbar>
                    <Typography variant="h3" component="div" sx={{flexGrow: 1}}>
                        Vendors content page
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default VendorsMain;