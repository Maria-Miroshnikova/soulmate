import React, {FC} from 'react';
import {AppBar, Toolbar, Typography, Button, Box} from "@mui/material";
import {Outlet} from "react-router";
import NavTabs from "./NavTabs";
import {themeMain} from "../../../theme";
import {useAppSelector} from "../../../hooks/redux";

const CustomAppBar: FC = () => {

    const textTitle = "Soulmate.";
    const textSignInButton = "Выход";
    const isModerator = useAppSelector(state => state.authReducer.isModerator);

    // TODO: выход!
    return (
        <>
        <AppBar
            position="sticky"
        >
            <Toolbar sx={{backgroundColor: themeMain.palette.primary.light}}>
                <Box display="flex" flexDirection="row" width="100%" alignItems="center">
                    <Typography variant="h6" noWrap component="div"> {textTitle} </Typography>
                    <Box justifyContent="flex-end" flexGrow="1" display="flex" flexDirection="row">
                        {
                            (isModerator!) ?
                                null
                                :
                                <NavTabs />
                        }
                        <Button color="inherit"> {textSignInButton} </Button>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
            <Outlet/>
        </>
    );
};

export default CustomAppBar;