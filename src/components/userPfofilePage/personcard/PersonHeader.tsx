import React, {FC} from 'react';
import {Avatar, Box, Button, Typography} from "@mui/material";
import {UserPersonalInfoModel} from "../../../types/UserModels";
import {PersonType} from "../lists/PersonList";

export interface PersonHeaderProps {
    person: UserPersonalInfoModel,
    onClick: (id: string) => void
}

//TODO : avatar
const PersonHeader: FC<PersonHeaderProps> = ({person, onClick}) => {

    return (
        <Box display="flex" flexDirection="row" gap={2} alignItems="center">
            <Avatar onClick={(event) => onClick(person.id)}>
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