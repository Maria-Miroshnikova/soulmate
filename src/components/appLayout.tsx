import React from 'react';
import {Box} from "@mui/material";
import CustomAppBar from "./UI/appbar/CustomAppBar";
import FilterPageContent from "./filterPage/FilterPageContent";
import MyDrawer from "./UI/drawer/MyDrawer";
import {Outlet} from "@mui/icons-material";

const AppLayout = () => {
    const sideMargin = "128px";

    return (
        <Box height="100%">
            <CustomAppBar />
        </Box>
    );
};

export default AppLayout;