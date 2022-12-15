import React, {FC, useEffect, useState} from 'react';
import {AppBar, Toolbar, Typography, Button, Box} from "@mui/material";
import {Outlet} from "react-router";
import NavTabs from "./NavTabs";
import {themeMain} from "../../../theme";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {gapi} from "gapi-script";
import {login_success, logout} from "../../../store/reducers/authSlice";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../../../router/routes";

const CustomAppBar: FC = () => {

    const clientId = "407844009418-2hui8hbgvgpi034p4eb8ooer9akbnknj.apps.googleusercontent.com";
    const SCOPES = 'https://www.googleapis.com/auth/drive';

    const textTitle = "Soulmate.";
    const isModerator = useAppSelector(state => state.authReducer.isModerator);

    const textLogin = "Войти";
    const textLogout = "Выйти";

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isAuth = useAppSelector(state => state.authReducer.isAuth);

  /*  useEffect(() => {
        const initClient = () => {
            gapi.client.init({
                clientId: clientId,
                scope: SCOPES
            }).then(function () {
                observeAuthStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
                gapi.auth2.getAuthInstance().isSignedIn.listen(observeAuthStatus);
            });
        };
        gapi.load('client:auth2', initClient);
    });*/

    const handleClickLogButton = () => {
        console.log("CKICK");
        if (isAuth) {
            console.log("OUT");
            // переадресация
            navigate('/');
            gapi.auth2.getAuthInstance().signOut();
        }
        else {
            console.log("IN");
            gapi.auth2.getAuthInstance().signIn();
        }
    }

    const observeAuthStatus = (toLogin: boolean) => {
        console.log("OBSERVE");
        if (toLogin) {
            handleLogin();
        }
        else {
            handleLogout();
        }
    }

    const handleLogin = () => {
        // перенаправление на фильтр
       // navigate(ROUTES.pages.filter);
        const user = gapi.auth2.getAuthInstance().currentUser.get();
        console.log("AUTH: ", user);
        dispatch(login_success({
            userId: user.getAuthResponse().id_token,
            accessToken: user.getAuthResponse().access_token
        }));
    }

    const handleLogout = () => {
        dispatch(logout());
        console.log("LOGED OUT");
    }

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
                            (isModerator! || !isAuth) ?
                                null
                                :
                                <NavTabs />
                        }
                        <Button color="inherit" onClick={handleClickLogButton} id="login_btn">
                            { (isAuth) ?
                                textLogout
                                :
                                textLogin
                            }
                        </Button>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
            <Outlet/>
        </>
    );
};

export default CustomAppBar;