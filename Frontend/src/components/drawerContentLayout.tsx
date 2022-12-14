import React, {FC, ReactNode} from 'react';
import {Box, Grid, Typography} from "@mui/material";
import MyDrawer from "./UI/drawer/MyDrawer";
import {Outlet} from "react-router";
import {themeMain} from "../theme";

interface DrawerContentLayoutProps{
    drawerContent: ReactNode
}

/*
<Box width="100%" height="100%" minHeight="100vh" sx={{ background: themeMain.palette.background.default}} display="flex" flexDirection="column">
                <Box display="flex" flexDirection="row" height="100%" sx={{ marginLeft: sideMargin, marginRight: sideMargin}}>
                    <MyDrawer children={drawerContent}/>
                    <Outlet />
                </Box>
            </Box>
 */

/*
<Box display="flex" flexDirection="row" sx={{background: "yellow"}} justifyContent="center">
            <Grid container height="100%" minHeight="100vh" display="flex" flexDirection="row" flexGrow={1} flexWrap="wrap" minWidth="400px" maxWidth="800px">
                <Grid item minHeight="100%" width="100px" sx={{background: "green"}}>
                    <Typography> 1 </Typography>
                </Grid>
                <Grid item sx={{background: "blue"}} flexGrow={1}>
                    <Typography> 2 </Typography>
                </Grid>
            </Grid>
        </Box>
 */

const DrawerContentLayout: FC<DrawerContentLayoutProps> = ({drawerContent}) => {

    return (
        <Box display="flex" flexDirection="row" sx={{background: themeMain.palette.background.default, paddingBottom: 8}} justifyContent="center">
            <Grid container height="100%" minHeight="100vh" display="flex" flexDirection="row" flexGrow={1} flexWrap="wrap" minWidth="max-content" maxWidth="1000px" overflow="">
                <Grid item minHeight="100%">
                    <MyDrawer children={drawerContent}/>
                </Grid>
                <Grid item flexGrow={1}>
                    <Outlet />
                </Grid>
            </Grid>
        </Box>
    );
};

export default DrawerContentLayout;