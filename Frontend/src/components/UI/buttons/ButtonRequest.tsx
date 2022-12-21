import React, {FC} from 'react';
import {ButtonPersonProps} from "./ButtonFriend";
import {useAppSelector} from "../../../hooks/redux";
import {userdataAPI} from "../../../services/userdataService";
import {Box, Button} from "@mui/material";

const ButtonRequest: FC<ButtonPersonProps> = ({person}) => {

    const textDelete = "Отказать";
    const textAdd = "Принять";

    const userId = useAppSelector(state => state.authReducer.userId);
    const [acceptRequest] = userdataAPI.useAcceptRequestToFriendsMutation();
    const [denyRequest] = userdataAPI.useDenyRequstToFriendsMutation();

    const handleDelete = () => {
        denyRequest({
            userId: userId!,
            personId: person.id
        })
    }

    const handleAdd = () => {
        acceptRequest({
            userId: userId!,
            personId: person.id
        })
    }

     //  <Button variant="contained" onClick={handleDelete} > {textDelete} </Button>

    return (
        <Box display="flex" flexDirection="row" gap={1}>
         
            <Button variant="contained" onClick={handleAdd} > {textAdd} </Button>
        </Box>
    );
};

export default ButtonRequest;