import React, {FC, ReactNode} from 'react';
import {Box} from "@mui/material";
import MyDrawer from "./UI/drawer/MyDrawer";
import {Outlet} from "react-router";

interface DrawerContentLayoutProps{
    drawerContent: ReactNode
}

const DrawerContentLayout: FC<DrawerContentLayoutProps> = ({drawerContent}) => {
    const sideMargin = "128px";

    return (
        <Box width="100%" height="100%" sx={{ background: "gray"}}>
            <Box display="flex" flexDirection="row" height="100%" sx={{ marginLeft: sideMargin, marginRight: sideMargin}}>
                <MyDrawer children={drawerContent}/>
                <Outlet />
            </Box>
        </Box>
    );
};

export default DrawerContentLayout;