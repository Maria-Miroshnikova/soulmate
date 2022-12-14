import React, {useEffect} from 'react';
import {Box, Button, Typography} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import {gapi} from "gapi-script";
import {login_success, logout} from "../../store/reducers/authSlice";


const StartPage = () => {

  /*  const clientId = "407844009418-2hui8hbgvgpi034p4eb8ooer9akbnknj.apps.googleusercontent.com";
    const SCOPES = 'https://www.googleapis.com/auth/drive';

    const textLogin = "Войти";
    const textLogout = "Выйти";

    const dispatch = useAppDispatch();
    const isAuth = useAppSelector(state => state.authReducer.isAuth);

    useEffect(() => {
        const initClient = () => {
            gapi.client.init({
                clientId: clientId,
                scope: SCOPES
            }).then(function () {
                console.log("auth instance: ", gapi.auth2.getAuthInstance());
                console.log("issignedin: ",  gapi.auth2.getAuthInstance().isSignedIn);
                observeAuthStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
                gapi.auth2.getAuthInstance().isSignedIn.listen(observeAuthStatus);
                /* gapi.auth2.getAuthInstance().attachClickHandler(
                     "login_btn",
                     {},
                     function (currentUser) {},
                     function (error) {
                         console.log('GAuth Error:', error);
                     });*/
            /*});
        };
        gapi.load('client:auth2', initClient);
    });

    const handleClickLogButton = () => {
        console.log("CKICK");
        if (isAuth) {
            console.log("OUT");
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
            const user = gapi.auth2.getAuthInstance().currentUser.get();
            console.log("AUTH: ", user);
            dispatch(login_success({
                userId: user.getAuthResponse().id_token,
                accessToken: user.getAuthResponse().access_token
            }));
        }
        else {
            dispatch(logout());
            console.log("LOGED OUT");
        }
    }
     <Button onClick={handleClickLogButton}>
                { (isAuth) ?
                    textLogout
                    :
                    textLogin
                }
            </Button>
    */

    const textTitle = "SOULMATE.";
    const textSubTitle = "lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum";

    return (
        <Box display="flex" flexDirection="column" width="100%" height="100%" minHeight="100vh" alignItems="center" justifyContent="center">
            <Typography fontSize="16vw">{textTitle}</Typography>
            <Typography align="justify" fontSize="2vw">{textSubTitle}</Typography>
        </Box>
    );
};

export default StartPage;