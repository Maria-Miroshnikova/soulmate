import React from 'react';
import {Box} from "@mui/material";
import CommonCard from "../commonscard/CommonCard";
import {Categories} from "../../../types/Categories";


/*
<CommonCard category={Categories.BOOK}/>
            <CommonCard category={Categories.GAME}/>
            <CommonCard category={Categories.MUSIC}/>
 */

const PersonProfileContent = () => {
    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <CommonCard category={Categories.FILM}/>
        </Box>
    );
};

export default PersonProfileContent;