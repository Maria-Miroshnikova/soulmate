import React, {FC} from 'react';
import {ButtonPersonProps} from "./ButtonFriend";
import {useAppSelector} from "../../../hooks/redux";
import {userdataAPI} from "../../../services/userdataService";
import {Box, Button} from "@mui/material";

const ButtonMyRequest: FC<ButtonPersonProps> = ({person}) => {
    const textClose = "Отозвать запрос";

    const userId = useAppSelector(state => state.authReducer.userId);
    const [closeRequest] = userdataAPI.useCloseMyRequestToBeFriendsMutation();

    const handleClode = () => {
        closeRequest({
            userId: userId!,
            personId: person.id
        })
    }

    return (
        <Box display="flex" flexDirection="row" gap={1}>
            <Button variant="contained" onClick={handleClode} > {textClose} </Button>
        </Box>
    );
};

export default ButtonMyRequest;