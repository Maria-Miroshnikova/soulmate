import React, {FC} from 'react';
import {useAppSelector} from "../../../hooks/redux";
import {userdataAPI} from "../../../services/userdataService";
import {UserPersonalInfoModel} from "../../../types/UserModels";
import {Box, Button} from "@mui/material";

export interface ButtonPersonProps {
    person: UserPersonalInfoModel
}

const ButtonFriend: FC<ButtonPersonProps> = ({person}) => {
    const textDelete = "Удалить";
    const textTelegram = "Telegram";

    const userId = useAppSelector(state => state.authReducer.userId);
    const [removeFriend] = userdataAPI.useRemovePersonFromFriendsMutation()

    const handleDelete = () => {
        removeFriend({personId: person.id, userId: userId!});
    }

    // TODO: open telegram
    const handleTelegram = () => {

    }

    return (
        <Box display="flex" flexDirection="row" gap={1}>
            <Button variant="contained" onClick={handleDelete} > {textDelete} </Button>
            <Button variant="contained" onClick={handleTelegram} > {textTelegram} </Button>
        </Box>
    );
};

export default ButtonFriend;