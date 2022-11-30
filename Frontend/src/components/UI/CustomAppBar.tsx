import React, {FC} from 'react';
import {AppBar, Toolbar, Typography} from "@mui/material";
import {Outlet} from "react-router";

const CustomAppBar: FC = () => {
    return (
        <>
        <AppBar
            position="sticky"
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
            <Toolbar>
                <Typography variant="h6" noWrap component="div">
                    Clipped drawer
                </Typography>
            </Toolbar>
        </AppBar>
            <Outlet/>
        </>
    );
};

export default CustomAppBar;