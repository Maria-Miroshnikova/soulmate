import React, {FC} from 'react';
import {useAppSelector} from "../../../hooks/redux";
import {userdataAPI} from "../../../services/userdataService";
import {UserPersonalInfoModel} from "../../../types/UserModels";
import {Box, Button, Link} from "@mui/material";

export interface ButtonPersonProps {
    person: UserPersonalInfoModel
}

const ButtonFriend: FC<ButtonPersonProps> = ({person}) => {
    const textDelete = "Удалить";
    const textTelegram = "Telegram";
    const textNoTelegram = "Telegram не указан";

    const userId = useAppSelector(state => state.authReducer.userId);
    const [removeFriend] = userdataAPI.useRemovePersonFromFriendsMutation()

    const handleDelete = () => {
        removeFriend({personId: person.id, userId: userId!});
    }

    /*
    // кнопка с переходом по ссылке
    <Button variant="contained" href={person.telegram}> {textTelegram} </Button>
     */
    return (
        <Box display="flex" flexDirection="row" gap={1}>
            <Button variant="contained" onClick={handleDelete} > {textDelete} </Button>
            {
                ((person.telegram === undefined) || (person.telegram === null) || (person.telegram === "")) ?
                    <Button variant="contained" disabled> {textNoTelegram} </Button>
                    :
                    <Button variant="contained" href={person.telegram}> {person.telegram} </Button>
            }
        </Box>
    );
};

export default ButtonFriend;