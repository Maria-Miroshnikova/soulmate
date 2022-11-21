import React, {FC} from 'react';
import {PersonCardProps} from "./PersonCardFriend";
import {Box, Button, Card, CardContent} from "@mui/material";
import PersonHeader from "./PersonHeader";

const PersonCardRequest: FC<PersonCardProps> = ({person}) => {
    const textDelete = "Отказать";
    const textAdd = "Принять";

    const handleDelete = () => {

    }

    const handleAdd = () => {

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
                        <Button variant="contained" onClick={handleAdd}> {textAdd} </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default PersonCardRequest;