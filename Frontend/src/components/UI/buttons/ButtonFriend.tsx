import React, {FC} from 'react';
import {useAppSelector} from "../../../hooks/redux";
import {userdataAPI} from "../../../services/userdataService";
import {UserPersonalInfoModel} from "../../../types/UserModels";
import {Box, Button, Link} from "@mui/material";
import {useNavigate} from "react-router-dom";

export interface ButtonPersonProps {
    person: UserPersonalInfoModel
}

const ButtonFriend: FC<ButtonPersonProps> = ({person}) => {
    const textDelete = "Удалить";
    const textTelegram = "Telegram";
    const navigate = useNavigate();

    const userId = useAppSelector(state => state.authReducer.userId);
    const [removeFriend] = userdataAPI.useRemovePersonFromFriendsMutation()

    const handleDelete = () => {
        removeFriend({personId: person.id, userId: userId!});
    }

    return (
        <Box display="flex" flexDirection="row" gap={1}>
            <Button variant="contained" onClick={handleDelete} > {textDelete} </Button>
            <Button variant="contained" href={person.telegram}> {textTelegram} </Button>
        </Box>
    );
};

export default ButtonFriend;