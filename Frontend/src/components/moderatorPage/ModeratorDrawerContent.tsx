import React, {FC, useEffect, useState} from 'react';
import {Typography} from "@mui/material";
import {useAppSelector} from "../../hooks/redux";

const ModeratorDrawerContent: FC = () => {

    const moderatorId = useAppSelector(state => state.authReducer.userId);
    const title = "Moderator ID: " + moderatorId;

    return (
        <Typography align="center"> {title} </Typography>
    );
};

export default ModeratorDrawerContent;