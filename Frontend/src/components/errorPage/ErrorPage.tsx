import React from 'react';
import {Box, Link, Typography} from "@mui/material";
import {NavLink} from "react-router-dom";
import {themeMain} from "../../theme";

const ErrorPage = () => {

    const textTitle = "Ошбика: неверный url";
    const textSubtitle = "вернуться на начальную страницу";

    return (
        <Box display="flex" gap={1} flexDirection="column" width="100%" height="100%" minHeight="100vh" alignItems="center" justifyContent="center">
            <Typography variant="h5">{textTitle}</Typography>
            <Link href={'/'} sx={{color: "red"}}> {textSubtitle} </Link>
        </Box>
    );
};

export default ErrorPage;