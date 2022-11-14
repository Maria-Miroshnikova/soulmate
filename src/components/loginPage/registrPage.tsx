import React from 'react';
import {Box, Button, Link, TextField, Typography} from "@mui/material";

const RegistrPage = () => {

    const width = "512px";

    const textSignUp = "Sign up";
    const textEmailTextField = "Email";
    const textPasswordTextField = "Password";
    const textButton = "Sign up";
    const textLinkAuth = "Already have an account? Sign in!";
    const errorText = "Пользователь с таким email уже существует.";

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const result = {
            email: data.get("email"),
            password: data.get("password")
        }

        // TODO
        /* отправка */
    }

    const handleLinkToAuthPage = () => {
        // TODO
    }

    // TODO добавить ошибку error полям
    return (
        <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="100%" position="fixed" top="0" left="0" >
            <Box width={width} display="flex" flexDirection="column" component="form" onSubmit={handleSubmit} gap={2}>
                <Box display="flex" flexDirection="column" justifyContent="center" gap={2} sx={{ marginBottom: 1}}>
                    <Typography align="center" variant="h5"> {textSignUp} </Typography>
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
                    onClick={handleLinkToAuthPage}
                >
                    {textLinkAuth}
                </Link>
            </Box>
        </Box>
    );
};

export default RegistrPage;