import React, {FC, useEffect, useState} from 'react';
import {AppBar, Toolbar, Typography, Button, Box} from "@mui/material";
import {Outlet} from "react-router";
import NavTabs from "./NavTabs";
import {themeMain} from "../../../theme";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {gapi} from "gapi-script";
import {login_success, logout} from "../../../store/reducers/authSlice";
import {useLocation, useNavigate} from "react-router-dom";
import {ROUTES} from "../../../router/routes";
import {loginAPI} from "../../../services/loginService";
import {href_HACK, loginOauthAPI, Yandex_href_HACK} from "../../../services/loginOauthService";
import axios from "axios";
import {LoginResponseDataJson} from "../../../types/response_types/LoginResponseJson";

const CustomAppBar: FC = () => {

   // const clientId = "407844009418-2hui8hbgvgpi034p4eb8ooer9akbnknj.apps.googleusercontent.com";
  //  const SCOPES = 'https://www.googleapis.com/auth/drive';

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

  /*  const handleClickLogButton = () => {
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
    }*/

   // const [login] = loginAPI.useLazyLoginQuery();
    const [login] = loginAPI.useLazyLoginQuery();
   // const [getAccessToken] = loginOauthAPI.useGetAccessTokenMutation();

    const handleClickLogButton = () => {
        if (isAuth) {
            console.log("OUT");
            // переадресация
            navigate('/');
            dispatch(logout());
        }
        else {
            console.log("IN");
            navigate(href_HACK);
            //login().then(response => console.log("RESPONSE: ", response));
        }
    }

    const location = useLocation();

    // через github
    useEffect(() => {
        const hadCode = location.search.search('code');
        if (hadCode === 1) {
            const code = location.search.split('=')[1];
            console.log('ВХОД', code);
            getAccessTokenFunc(code);
        }
    }, [location.search])

    const getAccessTokenFunc = async (code: string) => {
        const response = await axios.get('http://localhost:9999/authenticate/'+code);
        console.log("RESPONSE: ", response.data);
        if (response.data.error === "bad_code")
            navigate('/');
        else {
            login(response.data.token);
        }
    }

    const isGitAuth = false;
    const [loginYandex] = loginOauthAPI.useLazyLogin_yandexQuery();

    const handleLoginYandex = () => {
        loginYandex();
    }

    // через yandex
    useEffect(() => {
        //console.log("location", location.hash);
        const hadToken = location.hash.search('access_token');
        if (hadToken === 1) {
            //const params: URLSearchParams = new URLSearchParams(location.hash);
            //console.log('params', params);
            const token = location.hash.split('=')[1].split('&')[0];
            const token_type = location.hash.split('=')[2].split('&')[0];
            console.log('ВХОД', token);
            //console.log('ТИП', token_type);
            navigate('/');
            handleYandexLoginResponse(token);
        }
    }, [location.hash])

    const handleYandexLoginResponse = (token: string) => {
        login(token).unwrap().then(response => {
            if (response.user_id === "")
            {
                console.log("LOGIN RESPONSE: ERROR");
            }
            else {
                dispatch(login_success({userId: response.user_id, accessToken: response.access_token, refreshToken: response.refresh_token}));
            }
        });
    }

    /*
    <Button color="inherit" id="login_btn" onClick={handleLoginYandex}>
                                        {textLogin}
                                    </Button>
     */
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
                        {
                            (isAuth) ?
                                <Button color="inherit" onClick={handleClickLogButton} id="login_btn">
                                    {textLogout}
                                </Button>
                                :
                                (isGitAuth) ?
                                    <Button color="inherit" href={href_HACK} id="login_btn">
                                        {textLogin}
                                    </Button>
                                    :
                                    <Button color="inherit" id="login_btn" href={Yandex_href_HACK}>
                                        {textLogin}
                                    </Button>
                        }
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
            <Outlet/>
        </>
    );
};

export default CustomAppBar;