import React, {FC} from 'react';
import {ButtonPersonProps} from "./ButtonFriend";
import {useAppSelector} from "../../../hooks/redux";
import {userdataAPI} from "../../../services/userdataService";
import {Button} from "@mui/material";

const ButtonVisited: FC<ButtonPersonProps> = ({person}) => {

    const textAdd = "Подать заявку";

    const userId = useAppSelector(state => state.authReducer.userId);
    const [sendRequest] = userdataAPI.useRequestPersonToBeFriendsMutation();

    const handleRequest = () => {
        sendRequest({
            userId: userId!,
            personId: person.id
        })
    }

    // <Button variant="contained" onClick={handleRequest}> {textAdd} </Button>
    // TODO: пока что посещенные цепляют и друзей и т д на бэкэнде, поэтому пока не надо кнопки
    return (
        null
    );
};

export default ButtonVisited;