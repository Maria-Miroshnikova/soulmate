import React, {FC} from 'react';
import {PersonCardProps} from "./PersonCardFriend";
import {Box, Button, Card, CardContent} from "@mui/material";
import PersonHeader from "./PersonHeader";
import {userdataAPI} from "../../../services/userdataService";
import {useAppSelector} from "../../../hooks/redux";

const PersonCardRequest: FC<PersonCardProps> = ({person, onClick}) => {
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

    return (
        <Card>
            <CardContent>
                <Box display="flex" flexDirection="row" width="100%" alignItems="center" gap={3}>
                    <PersonHeader person={person} onClick={onClick}/>
                    <Box display="flex" flexDirection="row" justifyContent="flex-end" flexGrow="1" alignItems="center" gap={1}>
                        <Button variant="contained" onClick={handleDelete}> {textDelete} </Button>
                        <Button variant="contained" onClick={handleAdd}> {textAdd} </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default PersonCardRequest;