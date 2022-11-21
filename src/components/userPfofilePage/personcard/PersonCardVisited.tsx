import React, {FC} from 'react';
import {PersonCardProps} from "./PersonCardFriend";
import {Box, Button, Card, CardContent} from "@mui/material";
import PersonHeader from "./PersonHeader";
import {useAppSelector} from "../../../hooks/redux";
import {userdataAPI} from "../../../services/userdataService";

const PersonCardVisited: FC<PersonCardProps> = ({person, onClick}) => {
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
        <Card>
            <CardContent>
                <Box display="flex" flexDirection="row" width="100%" alignItems="center" gap={3}>
                    <PersonHeader person={person} onClick={onClick}/>
                    <Box display="flex" flexDirection="row" justifyContent="flex-end" flexGrow="1" alignItems="center" gap={1}>
                        <Button variant="contained" onClick={handleRequest}> {textAdd} </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default PersonCardVisited;