import React, {useEffect} from 'react';
import {Box, Button, Link, TextField, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../../router/routes";
import {loginAPI, LoginRequest} from "../../services/loginService";
import {useAppDispatch} from "../../hooks/redux";
import {login_success} from "../../store/reducers/authSlice";

const AuthPage = () => {

    const width = "512px";

    const textSignIn = "Sign in";
    const textEmailTextField = "Email";
    const textPasswordTextField = "Password";
    const textButton = "sign in";
    const textLinkRegistr = "Don`t have an account? Sign up!"
    const errorText = "Неверный email или пароль.";

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [trigger, { isLoading, data: loginResponse, error, isSuccess }] = loginAPI.useLazyLoginQuery();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const loginRequest: LoginRequest = {
            email: data.get("email")!.toString(),
            password: data.get("password")!.toString()
        }

        // TODO
        /* отправка */
        trigger.call({}, loginRequest);
    }

    useEffect(() => {
        console.log("useeffect!")
        if (isSuccess) {
            dispatch(login_success(loginResponse!));
            // TODO
            // navigate()
        }
        else {
            // TODO: обработка ошибки типа уже есть такой юзер
        }
    }, [isSuccess])

    const handleLinkToRegistrationPage = () => {
        navigate(ROUTES.base_url + ROUTES.pages.registr);
    }

    // TODO добавить ошибку error полям
    return (
        <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="100%" position="fixed" top="0" left="0" >
            <Box width={width} display="flex" flexDirection="column" component="form" onSubmit={handleSubmit} gap={2}>
                <Box display="flex" flexDirection="column" justifyContent="center" gap={2} sx={{ marginBottom: 1}}>
                    <Typography align="center" variant="h5"> {textSignIn} </Typography>
                    {
                        (!true) ?
                            null
                            :
                            <Typography align="center" variant="subtitle1" color="red"> {errorText} </Typography>
                    }
                </Box>
                <TextField
                    fullWidth
                    name="email"
                    required
                    label={textEmailTextField} />
                <TextField
                    fullWidth
                    name="password"
                    required
                    label={textPasswordTextField} />
                <Button fullWidth variant="contained" type="submit" sx={{marginTop: 2, marginBottom: 1}}> {textButton} </Button>
                <Link
                    variant="subtitle1"
                    align="right"
                    underline="hover"
                    color="secondary"
                    component="button"
                    onClick={handleLinkToRegistrationPage}
                >
                    {textLinkRegistr}
                </Link>
            </Box>
        </Box>
    );
};

export default AuthPage;