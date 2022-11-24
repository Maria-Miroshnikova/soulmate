import React from 'react';
import {Box} from "@mui/material";
import CommonCard from "../commonscard/CommonCard";
import {Categories} from "../../../types/Categories";

const PersonProfileContent = () => {
    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <CommonCard category={Categories.FILM}/>
            <CommonCard category={Categories.BOOK}/>
            <CommonCard category={Categories.GAME}/>
            <CommonCard category={Categories.MUSIC}/>
        </Box>
    );
};

export default PersonProfileContent;