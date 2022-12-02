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

    return (
        <Button variant="contained" onClick={handleRequest}> {textAdd} </Button>
    );
};

export default ButtonVisited;