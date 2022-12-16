import React, {FC} from 'react';
import {ButtonPersonProps} from "./ButtonFriend";
import {useAppSelector} from "../../../hooks/redux";
import {userdataAPI} from "../../../services/userdataService";
import {Box, Button} from "@mui/material";

const ButtonOldRequest: FC<ButtonPersonProps> = ({person}) => {

    const textAdd = "Принять";

    const userId = useAppSelector(state => state.authReducer.userId);
    const [acceptRequest] = userdataAPI.useAcceptRequestToFriendsMutation();

    const handleAdd = () => {
        acceptRequest({
            userId: userId!,
            personId: person.id
        })
    }

    return (
        <Box display="flex" flexDirection="row" gap={1}>
            <Button variant="contained" onClick={handleAdd} > {textAdd} </Button>
        </Box>
    );
};

export default ButtonOldRequest;