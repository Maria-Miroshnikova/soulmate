import React, {FC} from 'react';
import {Avatar, Box, Typography} from "@mui/material";
import {UserCardInfo} from "../../types/UserCardInfo";
import {UserPersonalInfoModel} from "../../types/UserModels";

interface UserHeaderProps {
    user: UserPersonalInfoModel
}

// TODO: растянуть аватар
// TODO: кликабельность для обновления аватарки?
const UserHeader: FC<UserHeaderProps> = ({user}) => {
    return (
        <Box display="flex" flexDirection="row" gap={2} alignItems="center" >
            <Avatar>
                ?
            </Avatar>
            <Box display="flex" flexDirection="column">
                <Typography variant="h6"> {user.nickname} </Typography>
                <Typography variant="subtitle2"> {user.age} лет, {user.gender}  </Typography>
            </Box>
        </Box>
    );
};

export default UserHeader;