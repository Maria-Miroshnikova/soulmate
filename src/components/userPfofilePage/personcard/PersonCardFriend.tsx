import React, {FC} from 'react';
import {Box, Button, Card, CardContent, IconButton, Rating, Typography} from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import {UserPersonalInfoModel} from "../../../types/UserModels";
import PersonHeader from "./PersonHeader";
import {userdataAPI} from "../../../services/userdataService";
import {PersonType} from "../lists/PersonList";
import {useAppSelector} from "../../../hooks/redux";

export interface PersonCardProps {
    person: UserPersonalInfoModel,
    onClick: (id: string) => void
}

const PersonCardFriend: FC<PersonCardProps> = ({person, onClick}) => {
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
        <Card>
            <CardContent>
                <Box display="flex" flexDirection="row" width="100%" alignItems="center" gap={3}>
                    <PersonHeader person={person} onClick={onClick}/>
                    <Box display="flex" flexDirection="row" justifyContent="flex-end" flexGrow="1" alignItems="center" gap={1}>
                        <Button variant="contained" onClick={handleDelete}> {textDelete} </Button>
                        <Button variant="contained" onClick={handleTelegram}> {textTelegram} </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default PersonCardFriend;