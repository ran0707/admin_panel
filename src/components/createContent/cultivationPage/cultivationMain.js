import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

const CultivationMain = () =>{

    return(
        <div>
            <AppBar position="fixed">
                <Toolbar>
                    <Typography variant="h4" component="div" sx={{flexGrow: 1}}>
                        Cultivation content page
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default CultivationMain;