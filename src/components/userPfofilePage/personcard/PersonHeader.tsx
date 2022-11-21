import React, {FC} from 'react';
import {Avatar, Box, Typography} from "@mui/material";
import {UserPersonalInfoModel} from "../../../types/UserModels";

export interface PersonHeaderProps {
    person: UserPersonalInfoModel
}

//TODO : avatar
const PersonHeader: FC<PersonHeaderProps> = ({person}) => {

    return (
        <Box display="flex" flexDirection="row" gap={2} alignItems="center" >
            <Avatar>
                ?
            </Avatar>
            <Box display="flex" flexDirection="column">
                <Typography variant="h6"> {person.nickname} </Typography>
                <Typography variant="subtitle2"> {person.age} лет, {person.gender}  </Typography>
            </Box>
        </Box>
    );
};

export default PersonHeader;