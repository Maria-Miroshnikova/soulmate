import React, {FC} from 'react';
import {Box, Button, Card, CardContent, IconButton, Rating, Typography} from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import {UserPersonalInfoModel} from "../../../types/UserModels";
import PersonHeader from "./PersonHeader";

export interface PersonCardProps {
    person: UserPersonalInfoModel
}

const PersonCardFriend: FC<PersonCardProps> = ({person}) => {
    const textDelete = "Удалить";
    const textTelegram = "Telegram";

    const handleDelete = () => {

    }

    const handleTelegram = () => {

    }

    const handleGoToProfile = () => {

    }

    return (
        <Card onClick={handleGoToProfile}>
            <CardContent>
                <Box display="flex" flexDirection="row" width="100%" alignItems="center" gap={3}>
                    <PersonHeader person={person}/>
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