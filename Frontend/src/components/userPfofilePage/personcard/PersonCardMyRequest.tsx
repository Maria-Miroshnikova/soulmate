import React, {FC} from 'react';
import {Box, Card, CardContent} from "@mui/material";
import PersonHeader from "./PersonHeader";
import ButtonFriend from "../../UI/buttons/ButtonFriend";
import {PersonCardProps} from "./PersonCardFriend";

// TODO: создать для него страничку
const PersonCardMyRequest: FC<PersonCardProps> = ({person}) => {
    return (
        <Card>
            <CardContent>
                <Box display="flex" flexDirection="row" width="100%" alignItems="center" gap={3}>
                    <PersonHeader person={person}/>
                </Box>
            </CardContent>
        </Card>
    );
};

export default PersonCardMyRequest;